import { CONTRACTS_CONFIG } from "@/config/app";
import { FEE_TIER } from "@/models/models";
import { ethers } from "ethers";

// Uniswap V3 Pool init code hash
export const POOL_INIT_CODE_HASH =
  "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54";

/**
 * Computes the Uniswap V3 pool address for given token pair and fee
 * @param token0 - Address of token0 (must be < token1)
 * @param token1 - Address of token1 (must be > token0)
 * @param fee - Pool fee tier (500, 3000, 10000)
 * @param factoryAddress - Factory contract address (optional, defaults to mainnet)
 * @param initCodeHash - Pool init code hash (optional, defaults to mainnet)
 * @returns The computed pool address
 */
export function computePoolAddress(
  token0: string,
  token1: string,
  fee: FEE_TIER | number,
  factoryAddress: string = CONTRACTS_CONFIG.FACTORY_ADDRESS,
  initCodeHash: string = POOL_INIT_CODE_HASH
): string {
  // Ensure token0 < token1 (Uniswap V3 requirement)
  const [tokenA, tokenB] =
    token0.toLowerCase() < token1.toLowerCase()
      ? [token0, token1]
      : [token1, token0];

  // Encode the parameters for the salt
  const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "address", "uint24"],
    [tokenA, tokenB, fee]
  );

  // Create the salt by hashing the encoded parameters
  const salt = ethers.keccak256(encodedParams);

  // Compute CREATE2 address
  const poolAddress = ethers.getCreate2Address(
    factoryAddress,
    salt,
    initCodeHash
  );

  return poolAddress;
}

/**
 * Helper function to get pool address with sorted tokens
 * @param tokenA - Address of first token
 * @param tokenB - Address of second token
 * @param fee - Pool fee tier
 * @param factoryAddress - Factory contract address (optional)
 * @param initCodeHash - Pool init code hash (optional)
 * @returns Object with sorted tokens and computed pool address
 */
export function getPoolInfo(
  tokenA: string,
  tokenB: string,
  fee: FEE_TIER | number,
  factoryAddress?: string,
  initCodeHash?: string
) {
  // Sort tokens
  const [token0, token1] =
    tokenA.toLowerCase() < tokenB.toLowerCase()
      ? [tokenA, tokenB]
      : [tokenB, tokenA];

  const poolAddress = computePoolAddress(
    token0,
    token1,
    fee,
    factoryAddress,
    initCodeHash
  );

  return {
    token0,
    token1,
    fee,
    poolAddress,
  };
}

/**
 * Validates if a computed pool address matches the expected format
 * @param address - The address to validate
 * @returns boolean indicating if address is valid
 */
export function isValidPoolAddress(address: string): boolean {
  return ethers.isAddress(address);
}

// Common fee tiers in Uniswap V3
export const FEE_TIERS = {
  LOWEST: 100, // 0.01%
  LOW: 500, // 0.05%
  MEDIUM: 3000, // 0.3%
  HIGH: 10000, // 1%
} as const;
