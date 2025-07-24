import {
  FEE_TIER,
  POSITION_STATUS,
  UserPosition,
  UserToken,
} from "@/models/models";
import { Token } from "@uniswap/sdk-core";
import { Pool } from "@uniswap/v3-sdk";

export const TOKENS_MOCKED: UserToken[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xDF4BDAC4Ba259127D1c53C07cdd005AD54CCAfb0",
    decimals: 6,
    nativePrice: 0,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x08a19ce4b93e957add175f61e022b81894e66720",
    decimals: 18,
    nativePrice: 1,
  },
  {
    symbol: "WZERO",
    name: "Wrapped Zero",
    address: "0x08a19ce4b93e957add175f61e022b81894e66720",
    decimals: 18,
    nativePrice: 1,
  },
  {
    symbol: "TEST",
    name: "Test Token",
    address: "0x8346D72233072a255c13fE3f16adB8b7055D5EAf",
    decimals: 18,
    nativePrice: 0,
  },
];

export const POSITIONS_MOCKED: UserPosition[] = [
  {
    tokenId: "1",
    token0: TOKENS_MOCKED[0], // USDC
    token1: TOKENS_MOCKED[2], // WZERO
    poolId: "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8",
    feeTier: FEE_TIER.F3000,
    status: POSITION_STATUS.POSITION_STATUS_IN_RANGE,
    rangeUpper: "10.1234",
    rangeLower: "9.987654",
    amount0: "1000",
    amount1: "100",
    token0UncollectedFees: "100",
    token1UncollectedFees: "10",
  },
  {
    tokenId: "2",
    token0: TOKENS_MOCKED[2], // WZERO
    token1: TOKENS_MOCKED[3], // TEST
    poolId: "0x4e68ccd3e89f51c3074ca5072bbac773960dfa36",
    feeTier: FEE_TIER.F500,
    status: POSITION_STATUS.POSITION_STATUS_OUT_OF_RANGE,
    rangeUpper: "0.2345",
    rangeLower: "0.1234",
    amount0: "100",
    amount1: "1000",
    token0UncollectedFees: "0",
    token1UncollectedFees: "0",
  },
  {
    tokenId: "3",
    token0: TOKENS_MOCKED[3], // TEST
    token1: TOKENS_MOCKED[0], // USDC
    poolId: "0x99ac8ca7087fa4a2a1fb6357269965a2014abc35",
    feeTier: FEE_TIER.F100,
    status: POSITION_STATUS.POSITION_STATUS_CLOSED,
    rangeUpper: "1.1234",
    rangeLower: "0.9876",
    amount0: "0",
    amount1: "0",
    token0UncollectedFees: "100",
    token1UncollectedFees: "100",
  },
];

export const UNI_TOKEN_MOCKED_0 = new Token(
  1,
  "0x8346d72233072a255c13fe3f16adb8b7055d5eaf",
  1
);

export const UNI_TOKEN_MOCKED_1 = new Token(
  1,
  "0x08a19ce4b93e957add175f61e022b81894e66720",
  1
);
export const UNI_POOL_MOCKED = new Pool(
  UNI_TOKEN_MOCKED_0,
  UNI_TOKEN_MOCKED_1,
  10000,
  79228162514264337593543950336,
  0,
  0
);