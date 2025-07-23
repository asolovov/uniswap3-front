import { CONTRACTS_CONFIG } from "@/config/app";
import { UserToken } from "@/models/models";
import { getERC20Contract } from "@/packages/uniswap/contracts/erc20";
import { ethers } from "ethers";
import { getAddress } from "viem";

export enum METHOD {
  SWAP = "swap",
  POSITION = "position",
}

function getSpenderAddress(method: METHOD): `0x${string}` {
  return method === METHOD.SWAP
    ? getAddress(CONTRACTS_CONFIG.SWAP_ROUTER_ADDRESS)
    : getAddress(CONTRACTS_CONFIG.NFT_MANAGER_ADDRESS);
}

export async function checkAllowance(
  token: UserToken,
  amount: string,
  user: string,
  method: METHOD
): Promise<boolean> {
  const amountBig = ethers.parseUnits(amount, token.decimals);
  console.log("amount:", amount, "amountBig:", amountBig.toString());
  console.log("Token address:", token.address);
  console.log("Token:", token.symbol, token.decimals);
  const spender = getSpenderAddress(method);
  const contract = getERC20Contract(token.address);
  const allowance = await contract.allowance(user, spender);
  console.log("allowance:", allowance.toString());
  if (allowance === undefined) {
    throw new Error("Allowance check failed");
  }
  return allowance >= amountBig;
}

export async function approveAllowance(
  token: UserToken,
  amount: string,
  signer: ethers.AbstractSigner,
  method: METHOD
): Promise<boolean> {
  const amountBig = ethers.parseUnits(amount, token.decimals);
  const spender = getSpenderAddress(method);
  const contract = getERC20Contract(token.address);
  const tx = await contract.connect(signer).approve(spender, amountBig);
  await tx.wait();
  return true;
}
