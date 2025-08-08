import { UserToken } from "@/models/models";
import {
  getPoolContract,
  getPoolContractInstance,
} from "@/packages/uniswap/contracts/pool";
import { computePoolAddress, FEE_TIERS } from "@/packages/uniswap/pool/address";
import {
  calculateSqrtPriceLimit,
  isZeroForOne,
} from "@/packages/uniswap/utils/slippage";
import { ethers, ZeroAddress } from "ethers";
import { getBestQuotedRoute, getSwapData } from "./routing/route";
import { SwapType } from "./routing/types";
import { UniswapV3Contracts } from "./routing/config";

export interface TxData {
  txHash: string;
  feeChain: string;

  feeSwap: string;
  payed: string;
  received: string;
}

export const NoReceiptError = new Error("Receipt not found");

/**
 * Get current pool price and calculate slippage-adjusted sqrt price limit
 */
async function getSqrtPriceLimitWithSlippage(
  tokenIn: string,
  tokenOut: string,
  fee: number,
  slippage: number
): Promise<string> {
  const poolAddress = computePoolAddress(tokenIn, tokenOut, fee);
  const poolContract = getPoolContract(poolAddress);

  try {
    const slot0 = await poolContract.slot0();

    const sqrtPriceLimit = calculateSqrtPriceLimit(
      slot0.sqrtPriceX96.toString(),
      slippage,
      isZeroForOne(tokenIn, tokenOut)
    );

    return sqrtPriceLimit.toString();
  } catch (error) {
    console.warn("Could not fetch current price, using 0 for sqrtPriceLimit");
    return "0"; // Fallback to no price limit
  }
}

export async function executeSwap(
  payToken: UserToken,
  receiveToken: UserToken,
  payAmount: string,
  slippage: number,
  validity: number,
  signer: ethers.AbstractSigner
): Promise<TxData> {
  const { callData } = await getSwapData({
    signer: await signer.getAddress(),
    tokenIn: payToken.address,
    tokenOut: receiveToken.address,
    amount: ethers.parseUnits(payAmount, payToken.decimals),
    swapType: SwapType.EXACT_INPUT,
  });

  const tx: ethers.TransactionRequest = {
    from: await signer.getAddress(),
    to: UniswapV3Contracts.routerAddress,
    data: callData,
  };

  const receipt = await signer.sendTransaction(tx).then((tx) => tx.wait());
  if (!receipt) {
    throw NoReceiptError;
  }

  const { amountIn, amountOut } = parseSwapEvent(
    receipt,
    await signer.getAddress()
  );

  const swapResult: TxData = {
    txHash: receipt.hash,
    feeChain: ethers.formatEther(receipt.gasUsed * receipt.gasPrice),
    feeSwap: "0",
    payed: ethers.formatUnits(amountIn, payToken.decimals),
    received: ethers.formatUnits(amountOut, receiveToken.decimals),
  };

  return swapResult;
}

function getFeeInTokens(amount: string, fee: number, token: UserToken): string {
  const amountBig = ethers.parseUnits(amount, token.decimals);
  const feeAmount = (amountBig * BigInt(fee)) / BigInt(1000000);
  return ethers.formatUnits(feeAmount, token.decimals);
}

function parseSwapEvent(
  receipt: ethers.TransactionReceipt,
  signer: string
): { amountIn: bigint; amountOut: bigint } {
  const iface = new ethers.Interface([
    "event Transfer(address indexed from, address indexed to, uint256 value)",
  ]);

  const event = iface.getEvent("Transfer");
  if (!event) {
    throw new Error("Transfer event not found in contract interface");
  }

  const logs = receipt.logs?.filter((l) => l.topics[0] === event!.topicHash);
  if (!logs || logs.length === 0) {
    throw new Error("Transfer event not found in transaction logs");
  }
  let amountIn = BigInt(0);
  let amountOut = BigInt(0);

  for (const log of logs) {
    if (!log.data || log.data === "0x") {
      continue;
    }
    const args = iface.parseLog(log)?.args;
    if (!args) {
      throw new Error("Failed to parse Transfer event arguments");
    }
    if (args.from === signer) {
      amountIn = args.value;
    }
    if (args.to === signer) {
      amountOut = args.value;
    }
  }
  return { amountIn, amountOut };
}

export async function getQuotedPrice(
  tokenIn: UserToken,
  tokenOut: UserToken
): Promise<number> {
  const bestQuote = await getBestQuotedRoute({
    signer: ZeroAddress,
    tokenIn: tokenIn.address,
    tokenOut: tokenOut.address,
    amount: ethers.parseUnits("1", tokenIn.decimals),
    swapType: SwapType.EXACT_INPUT,
  });

  const price = Number.parseFloat(
    ethers.formatUnits(bestQuote.amountQuoted, tokenOut.decimals)
  );
  return price;
}
