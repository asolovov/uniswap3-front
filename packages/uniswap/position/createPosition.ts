import { Pool, Position } from "@uniswap/v3-sdk";

export function getPositionFromInput(
  amount0: string,
  amount1: string,
  pool: Pool,
  tickLower: number,
  tickUpper: number
): Position {
  const amount0Raw = (parseFloat(amount0) || 0) * 10 ** pool.token0.decimals;
  const amount1Raw = (parseFloat(amount1) || 0) * 10 ** pool.token1.decimals;

  // Create position based on which amount is provided
  if (amount0Raw > 0 && amount1Raw > 0) {
    // Amount0 provided, calculate position from amount0 and amount1
    return Position.fromAmounts({
      pool,
      tickLower,
      tickUpper,
      amount0: amount0Raw,
      amount1: amount1Raw,
      useFullPrecision: true,
    });
  } else if (amount0Raw > 0) {
    // Amount1 provided, calculate position from amount1
    return Position.fromAmount0({
      pool,
      tickLower,
      tickUpper,
      amount0: amount0Raw,
      useFullPrecision: true,
    });
  } else if (amount1Raw > 0) {
    // Amount1 provided, calculate position from amount1
    return Position.fromAmount1({
      pool,
      tickLower,
      tickUpper,
      amount1: amount1Raw,
    });
  }

  throw new Error("Invalid position parameters");
}
