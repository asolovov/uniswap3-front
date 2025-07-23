import {
  MintOptions,
  NonfungiblePositionManager,
  Position,
} from "@uniswap/v3-sdk";

export function getMintCalldata(
  positionToMint: Position,
  options: MintOptions
): { calldata: string; value: string } {
  // Ensure the position is valid
  if (!positionToMint) {
    throw new Error("Invalid position to mint");
  }

  // Create mint options
  //   const mintOptions: MintOptions = {
  //     recipient: address,
  //     deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
  //     slippageTolerance: new Percent(500, 10_000), // 5% slippage tolerance
  //   };

  // get calldata for minting a position
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(
    positionToMint,
    options
  );

  return { calldata, value };
}
