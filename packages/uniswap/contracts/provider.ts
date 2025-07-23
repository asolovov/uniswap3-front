import { CHAIN_CONFIG } from "@/config/app";
import { ethers } from "ethers";

export const getProvider = () => {
  return new ethers.JsonRpcProvider(CHAIN_CONFIG.RPC);
};
