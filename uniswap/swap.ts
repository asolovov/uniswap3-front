import { UserToken } from "@/models/models";
import { getRouterContract } from "@/packages/uniswap/contracts/router";
import { ethers } from "ethers";

export interface TxData {
  txHash: string;
  feeChain: string;

  feeSwap: string;
  payed: string;
  received: string;
}

export const NoReceiptError = new Error("Receipt not found");

export async function executeSwap(
  payToken: UserToken,
  receiveToken: UserToken,
  payAmount: string,
  slippage: number,
  validity: number,
  signer: ethers.AbstractSigner
): Promise<TxData> {
  const contract = getRouterContract();
  const timeNow = Math.floor(Date.now() / 1000);
  const swapParams = {
    tokenIn: payToken.address,
    tokenOut: receiveToken.address,
    fee: 10000,
    amountIn: ethers.parseUnits(payAmount, payToken.decimals),
    sqrtPriceLimitX96: 0,
    amountOutMinimum: 0,
    recipient: await signer.getAddress(),
    deadline: timeNow + validity * 60,
  };
  const tx = await contract.connect(signer).exactInputSingle(swapParams);
  const r = await tx.wait();
  if (!r) {
    throw NoReceiptError;
  }

  return {
    txHash: r.hash,
    feeChain: ethers.formatEther(r.fee),
  } as TxData;
}
