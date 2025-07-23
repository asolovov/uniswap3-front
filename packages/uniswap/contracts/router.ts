import { CoreContract } from "./types";
import { RouterABI } from "../abis/Router-abi";
import { CONTRACTS_CONFIG } from "@/config/app";
import { getAddress } from "viem/utils";
import { ethers } from "ethers";
import { getProvider } from "./provider";
import { SwapRouterRestricted } from "@/packages/types/uniswap-types/contracts/swap-router-restricted";

export const RouterContract: CoreContract<typeof RouterABI, `0x${string}`> = {
  abi: RouterABI,
  address: getAddress(CONTRACTS_CONFIG.SWAP_ROUTER_ADDRESS),
};

export const getRouterContract = () => {
  return new ethers.Contract(
    CONTRACTS_CONFIG.SWAP_ROUTER_ADDRESS,
    RouterABI,
    getProvider()
  ) as unknown as SwapRouterRestricted;
};
