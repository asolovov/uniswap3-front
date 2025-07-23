// import { CurrencyAmount, TradeType, Percent, Token } from "@uniswap/sdk-core";
// import { Pool, Route, Trade } from "@uniswap/v3-sdk";
// import {
//   SwapRouter,
//   SwapOptions,
//   SwapRoute,
// } from "@uniswap/smart-order-router";
// import { ethers } from "ethers";

// export interface SwapParams {
//   inputToken: Token;
//   outputToken: Token;
//   amountIn: string; // input amount as string
//   slippageTolerance: Percent;
//   recipient: string;
//   deadline: number; // unix timestamp
//   provider: ethers.providers.Provider;
//   poolFee: number; // e.g. 3000 for 0.3%
// }

// export async function prepareSwapCalldata({
//   inputToken,
//   outputToken,
//   amountIn,
//   slippageTolerance,
//   recipient,
//   deadline,
//   provider,
//   poolFee,
// }: SwapParams): Promise<{ calldata: string; value: string }> {
//   // 1. Fetch pool data
//   const poolAddress = await SwapRouter.getPoolAddress(
//     inputToken,
//     outputToken,
//     poolFee
//   );
//   const poolContract = new ethers.Contract(
//     poolAddress,
//     [
//       "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
//       "function liquidity() view returns (uint128)",
//     ],
//     provider
//   );
//   const [slot0, liquidity] = await Promise.all([
//     poolContract.slot0(),
//     poolContract.liquidity(),
//   ]);

//   // 2. Build the pool and route
//   const pool = new Pool(
//     inputToken,
//     outputToken,
//     poolFee,
//     slot0.sqrtPriceX96.toString(),
//     liquidity.toString(),
//     slot0.tick
//   );
//   const route = new Route([pool], inputToken, outputToken);

//   // 3. Create trade
//   const amount = CurrencyAmount.fromRawAmount(inputToken, amountIn);
//   const trade = Trade.exactIn(route, amount);

//   // 4. Prepare swap options
//   const options: SwapOptions = {
//     slippageTolerance,
//     recipient,
//     deadline,
//   };

//   // 5. Generate calldata
//   const methodParameters = SwapRouter.swapCallParameters(
//     [trade as unknown as SwapRoute],
//     options
//   );

//   return {
//     calldata: methodParameters.calldata,
//     value: methodParameters.value,
//   };
// }
