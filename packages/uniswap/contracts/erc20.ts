import { ContractInstance } from "./types";
import { ERC20ABI } from "../abis/ERC20-abi";
import { ethers } from "ethers";
import { getProvider } from "./provider";
import { ERC20 } from "@/packages/types/typechain-types";

export const ERC20Contract: ContractInstance<typeof ERC20ABI> = {
  abi: ERC20ABI,
};

export const getERC20Contract = (address: string) => {
  return new ethers.Contract(
    address,
    ERC20ABI,
    getProvider()
  ) as unknown as ERC20;
};
