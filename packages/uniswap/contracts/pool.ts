import { ContractInstance } from "./types";
import { PoolABI } from "../abis/Pool-abi";
import { ethers } from "ethers";
import { getProvider } from "./provider";
import { UniswapV3Pool } from "@/packages/types/uniswap-types/contracts/uniswap-v3-pool";
import { zeroAddress } from "viem";

export const PoolContract: ContractInstance<typeof PoolABI> = {
  abi: PoolABI,
};

export const getPoolContract = (address: string) => {
  return new ethers.Contract(
    address,
    PoolABI,
    getProvider()
  ) as unknown as UniswapV3Pool;
};

export const getPoolContractInstance = () => {
  return new ethers.Contract(
    zeroAddress,
    PoolABI,
    getProvider()
  ) as unknown as UniswapV3Pool;
};
