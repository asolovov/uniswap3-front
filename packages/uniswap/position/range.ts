import { nearestUsableTick, TickMath } from "@uniswap/v3-sdk";
import JSBI from "jsbi";

const STEP = 1.0001;

export function getNearestTickAndPrice(
  price: string,
  tickSpacing: number
): { tick: number; price: string } {
  const sqrtPriceX96 = JSBI.BigInt(Math.sqrt(parseFloat(price)) * 2 ** 96);
  const tick = nearestUsableTick(
    TickMath.getTickAtSqrtRatio(sqrtPriceX96),
    tickSpacing
  );
  const adjusted = STEP ** tick;
  return { tick, price: adjusted.toFixed(10).toString() };
}

export function getNextTickAndPrice(
  tick: number,
  tickSpacing: number
): { tick: number; price: string } {
  const nextTick = tick + tickSpacing;
  const adjusted = STEP ** nextTick;
  return { tick: nextTick, price: adjusted.toFixed(10).toString() };
}

export function getPrevTickAndPrice(
  tick: number,
  tickSpacing: number
): { tick: number; price: string } {
  const prevTick = tick - tickSpacing;
  const adjusted = STEP ** prevTick;
  return { tick: prevTick, price: adjusted.toFixed(10).toString() };
}
