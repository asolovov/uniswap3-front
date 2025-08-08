import { getAllRoutes } from "./api/fetchPools";
import { findBestRoute } from "./quote";
import { prepareSwapCalldata } from "./calldata";
import { QuoteResult, SwapParams } from "./types";

export async function getSwapData(
  params: SwapParams
): Promise<{ callData: string; amountQuoted: bigint }> {
  const bestRoute = await getBestQuotedRoute(params);

  const callData = prepareSwapCalldata(bestRoute, params);

  return { callData, amountQuoted: bestRoute.amountQuoted };
}

export async function getBestQuotedRoute(
  params: SwapParams
): Promise<QuoteResult> {
  const routes = await getAllRoutes(params.tokenIn, params.tokenOut);
  if (routes.length === 0) {
    throw new Error("No routes found for the given tokens");
  }

  const bestRoute = await findBestRoute(params.amount, routes, params.swapType);
  if (!bestRoute) {
    throw new Error("No quoted routes found for the given tokens");
  }

  return bestRoute;
}
