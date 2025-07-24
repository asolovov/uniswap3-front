import { UserToken } from "@/models/models";
import {
  getPoolContract,
  getPoolContractInstance,
} from "@/packages/uniswap/contracts/pool";
import { getRouterContract } from "@/packages/uniswap/contracts/router";
import { computePoolAddress, FEE_TIERS } from "@/packages/uniswap/pool/address";
import {
  calculateSqrtPriceLimit,
  isZeroForOne,
} from "@/packages/uniswap/utils/slippage";
import { ethers } from "ethers";

export interface TxData {
  txHash: string;
  feeChain: string;

  feeSwap: string;
  payed: string;
  received: string;
}

export const NoReceiptError = new Error("Receipt not found");

const X96BIG = BigInt(1) << BigInt(96);

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
  console.log("Slippage:", slippage);
  const fee = await getBestFee(payToken.address, receiveToken.address);

  // Calculate sqrt price limit based on slippage
  const sqrtPriceLimitX96 = await getSqrtPriceLimitWithSlippage(
    payToken.address,
    receiveToken.address,
    fee,
    slippage
  );

  // TODO: Calculate amountOutMinimum based on expected output and slippage
  const amountOutMinimum = 0;

  const contract = getRouterContract();
  const timeNow = Math.floor(Date.now() / 1000);
  const swapParams = {
    tokenIn: payToken.address,
    tokenOut: receiveToken.address,
    fee,
    amountIn: ethers.parseUnits(payAmount, payToken.decimals),
    sqrtPriceLimitX96,
    amountOutMinimum,
    recipient: await signer.getAddress(),
    deadline: timeNow + validity * 60,
  };

  const tx = await contract.connect(signer).exactInputSingle(swapParams);
  const r = await tx.wait();
  if (!r) {
    throw NoReceiptError;
  }

  const { amountIn, amountOut } = parseSwapEvent(r);

  const swapResult: TxData = {
    txHash: r.hash,
    feeChain: ethers.formatEther(r.gasUsed * r.gasPrice),
    feeSwap: getFeeInTokens(payAmount, fee, payToken),
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

function parseSwapEvent(receipt: ethers.TransactionReceipt) {
  const contract = getPoolContractInstance();

  const event = contract.interface.getEvent("Swap");
  if (!event) {
    throw new Error("Swap event not found in contract interface");
  }

  const log = receipt.logs?.find((l) => l.topics[0] === event!.topicHash);

  if (!log) {
    throw new Error("Swap event not found in transaction logs");
  }
  const args = contract.interface.parseLog(log)?.args;
  if (!args) {
    throw new Error("Failed to parse Swap event arguments");
  }

  const amount0 = BigInt(args.amount0);
  const amount1 = BigInt(args.amount1);

  // In - Out == Payed - Received
  if (amount0 > BigInt(0)) {
    return {
      amountIn: -amount1,
      amountOut: amount0,
    };
  } else {
    return {
      amountIn: amount1,
      amountOut: -amount0,
    };
  }
}

async function getBestFee(tokenA: string, tokenB: string): Promise<number> {
  for (const fee of Object.values(FEE_TIERS)) {
    const poolAddress = computePoolAddress(tokenA, tokenB, fee);
    const poolContract = getPoolContract(poolAddress);
    try {
      const liquidity = await poolContract.liquidity();
      if (liquidity > 0) {
        return fee;
      }
    } catch {
      continue;
    }
  }
  throw new Error("No valid pool found for the token pair");
}

export async function getPoolPrice(
  tokenIn: UserToken,
  tokenOut: UserToken
): Promise<number> {
  for (const fee of Object.values(FEE_TIERS)) {
    const poolAddress = computePoolAddress(
      tokenIn.address,
      tokenOut.address,
      fee
    );
    const poolContract = getPoolContract(poolAddress);
    const zeroForOne = isZeroForOne(tokenIn.address, tokenOut.address);
    const [d0, d1] = zeroForOne
      ? [tokenIn.decimals, tokenOut.decimals]
      : [tokenOut.decimals, tokenIn.decimals];
    try {
      const [slot0, liquidity] = await Promise.all([
        poolContract.slot0(),
        poolContract.liquidity(),
      ]);
      if (liquidity > 0) {
        const converted = (Number(slot0.sqrtPriceX96) / 2 ** 96) ** 2;

        const adjusted = (converted * 10 ** d0) / 10 ** d1;

        const price = zeroForOne ? adjusted : 1 / adjusted;
        return price;
      }
    } catch {
      continue;
    }
  }
  throw new Error("No valid pool found for the token pair");
}
