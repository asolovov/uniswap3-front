import {FEE_TIER, POSITION_STATUS, UserPosition} from "@/models/models";
import {Token} from "@uniswap/sdk-core";
import {Pool} from "@uniswap/v3-sdk";

export const TOKENS_MOCKED = [
    { symbol: "USDC", name: "USD Coin", address: "0x8346d72233072a255c13fe3f16adb8b7055d5eaf", decimals: 6, nativePrice: 0.00027},
    { symbol: "ETH", name: "Ethereum", address: "0x08a19ce4b93e957add175f61e022b81894e66720", decimals: 18, nativePrice: 1 },
    { symbol: "BTC", name: "Bitcoin",  address: "0xdf4bdac4ba259127d1c53c07cdd005ad54ccafb0", decimals: 8, nativePrice: 32.3 },
]

export const POSITIONS_MOCKED: UserPosition[] = [
    {
        tokenId: "1",
        token0: TOKENS_MOCKED[0], // USDC
        token1: TOKENS_MOCKED[1], // ETH
        poolId: "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8",
        feeTier: FEE_TIER.F3000,
        status: POSITION_STATUS.POSITION_STATUS_IN_RANGE,
        rangeUpper: "887220",
        rangeLower: "886220",
        amount0: "1000000000",
        amount1: "1000000000000000000",
        token0UncollectedFees: "100000",
        token1UncollectedFees: "100000000000000"
    },
    {
        tokenId: "2",
        token0: TOKENS_MOCKED[1], // ETH
        token1: TOKENS_MOCKED[2], // BTC
        poolId: "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36",
        feeTier: FEE_TIER.F500,
        status: POSITION_STATUS.POSITION_STATUS_OUT_OF_RANGE,
        rangeUpper: "887220",
        rangeLower: "886220",
        amount0: "10000000000000000000",
        amount1: "100000000",
        token0UncollectedFees: "1000000000000000",
        token1UncollectedFees: "10000"
    },
    {
        tokenId: "3",
        token0: TOKENS_MOCKED[0], // USDC
        token1: TOKENS_MOCKED[2], // BTC
        poolId: "0x99ac8ca7087fa4a2a1fb6357269965a2014abc35",
        feeTier: FEE_TIER.F100,
        status: POSITION_STATUS.POSITION_STATUS_CLOSED,
        rangeUpper: "887220",
        rangeLower: "886220",
        amount0: "5000000000",
        amount1: "50000000",
        token0UncollectedFees: "500000",
        token1UncollectedFees: "5000"
    }
]

export const UNI_TOKEN_MOCKED = new Token(1, "", 1)
export const UNI_POOL_MOCKED = new Pool(UNI_TOKEN_MOCKED, UNI_TOKEN_MOCKED, 10000, "1", "1", 1)