export interface UserToken {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    nativePrice: number;
}

export interface UserPosition {
    tokenId: string;
    token0: UserToken;
    token1: UserToken;
    poolId: string;
    feeTier: FEE_TIER;
    status: POSITION_STATUS;
    rangeUpper: string; // => tickUpper
    rangeLower: string; // => tickLower
    amount0: string;
    amount1: string;
    token0UncollectedFees: string;
    token1UncollectedFees: string;
}

export interface BUserPosition {
    v3Position: V3Position;
    status: string; // POSITION_STATUS_CLOSED, POSITION_STATUS_OUT_OF_RANGE, POSITION_STATUS_IN_RANGE
    timestamp: number;
}

export interface V3Position {
    tokenId: string;
    tickLower: string;
    tickUpper: string;
    liquidity: string;
    token0: UserToken;
    token1: UserToken;
    feeTier: string;
    currentTick: string;
    currentPrice: string;
    tickSpacing: string;
    token0UncollectedFees: string;
    token1UncollectedFees: string;
    amount0: string;
    amount1: string;
    poolId: string;
    totalLiquidityUsd: string;
    currentLiquidity: string;
    apr: number;
}

export enum POSITION_STATUS {
    POSITION_STATUS_CLOSED = "CLOSED",
    POSITION_STATUS_OUT_OF_RANGE = "OUT_OF_RANGE",
    POSITION_STATUS_IN_RANGE = "IN_RANGE",
}

export enum FEE_TIER {
    F100 = 0.01,
    F500 = 0.05,
    F3000 = 0.3,
    F10000 = 1.0,
}

export const FEE_TIERS = [FEE_TIER.F100, FEE_TIER.F500, FEE_TIER.F3000, FEE_TIER.F10000]

export const FEE_TIER_SPACINGS: {[key in FEE_TIER]: number} =  {
    [FEE_TIER.F100]: 1,
    [FEE_TIER.F500]: 10,
    [FEE_TIER.F3000]: 60,
    [FEE_TIER.F10000]: 200,
}
