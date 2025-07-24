import JSBI from "jsbi";

/**
 * Slippage utilities for Uniswap V3 swaps
 */

/**
 * Convert slippage percentage to basis points
 * @param slippagePercent - Slippage as percentage (e.g., 0.5 for 0.5%)
 * @returns Slippage in basis points (e.g., 50 for 0.5%)
 */
export function slippageToBasisPoints(slippagePercent: number): number {
  return Math.floor(slippagePercent * 100);
}

/**
 * Calculate sqrt price limit for Uniswap V3 swaps
 * @param currentSqrtPriceX96 - Current pool sqrt price (Q64.96 format)
 * @param slippageBasisPoints - Slippage in basis points (e.g., 50 = 0.5%)
 * @param zeroForOne - True if swapping token0 for token1
 * @returns Sqrt price limit as string
 */
export function calculateSqrtPriceLimit(
  currentSqrtPriceX96: string,
  slippage: number,
  zeroForOne: boolean
): string {
  const currentPrice = JSBI.BigInt(currentSqrtPriceX96);
  const slippageMultiplier = JSBI.BigInt(
    10000 - slippageToBasisPoints(slippage)
  );
  const denominator = JSBI.BigInt(10000);

  let priceLimit: JSBI;

  if (zeroForOne) {
    // Swapping token0 → token1: price goes down, set minimum acceptable price
    priceLimit = JSBI.divide(
      JSBI.multiply(currentPrice, slippageMultiplier),
      denominator
    );
  } else {
    // Swapping token1 → token0: price goes up, set maximum acceptable price
    priceLimit = JSBI.divide(
      JSBI.multiply(currentPrice, denominator),
      slippageMultiplier
    );
  }

  return priceLimit.toString();
}

export function calculateAmountOutMinimum(
  expectedAmountOut: string,
  slippageBasisPoints: number
): string {
  const expected = JSBI.BigInt(expectedAmountOut);
  const slippageMultiplier = JSBI.BigInt(10000 - slippageBasisPoints);
  const denominator = JSBI.BigInt(10000);

  const minimum = JSBI.divide(
    JSBI.multiply(expected, slippageMultiplier),
    denominator
  );

  return minimum.toString();
}

export function isZeroForOne(tokenIn: string, tokenOut: string): boolean {
  return tokenIn.toLowerCase() < tokenOut.toLowerCase();
}

export function formatSlippage(slippageBasisPoints: number): string {
  return `${(slippageBasisPoints / 100).toFixed(2)}%`;
}

export const SLIPPAGE_PRESETS = {
  VERY_LOW: 10, // 0.1%
  LOW: 50, // 0.5%
  MEDIUM: 100, // 1.0%
  HIGH: 300, // 3.0%
  VERY_HIGH: 500, // 5.0%
} as const;
