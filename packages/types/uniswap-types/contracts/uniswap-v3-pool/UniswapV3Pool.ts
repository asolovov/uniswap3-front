/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface UniswapV3PoolInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "burn"
      | "collect"
      | "collectProtocol"
      | "factory"
      | "fee"
      | "feeGrowthGlobal0X128"
      | "feeGrowthGlobal1X128"
      | "increaseObservationCardinalityNext"
      | "initialize"
      | "liquidity"
      | "maxLiquidityPerTick"
      | "mint"
      | "observations"
      | "observe"
      | "positions"
      | "protocolFees"
      | "setFeeProtocol"
      | "slot0"
      | "snapshotCumulativesInside"
      | "swap"
      | "tickBitmap"
      | "tickSpacing"
      | "ticks"
      | "token0"
      | "token1"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Burn"
      | "Collect"
      | "CollectProtocol"
      | "Flash"
      | "IncreaseObservationCardinalityNext"
      | "Initialize"
      | "Mint"
      | "SetFeeProtocol"
      | "Swap"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "burn",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "collect",
    values: [
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "collectProtocol",
    values: [AddressLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(functionFragment: "fee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "feeGrowthGlobal0X128",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "feeGrowthGlobal1X128",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "increaseObservationCardinalityNext",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "liquidity", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "maxLiquidityPerTick",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [AddressLike, BigNumberish, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "observations",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "observe",
    values: [BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "positions",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "protocolFees",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setFeeProtocol",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "slot0", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "snapshotCumulativesInside",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swap",
    values: [AddressLike, boolean, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "tickBitmap",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tickSpacing",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "ticks", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "token0", values?: undefined): string;
  encodeFunctionData(functionFragment: "token1", values?: undefined): string;

  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "collect", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "collectProtocol",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "fee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "feeGrowthGlobal0X128",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "feeGrowthGlobal1X128",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseObservationCardinalityNext",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "liquidity", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "maxLiquidityPerTick",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "observations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "observe", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "positions", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "protocolFees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFeeProtocol",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "slot0", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "snapshotCumulativesInside",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tickBitmap", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tickSpacing",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ticks", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token0", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token1", data: BytesLike): Result;
}

export namespace BurnEvent {
  export type InputTuple = [
    owner: AddressLike,
    tickLower: BigNumberish,
    tickUpper: BigNumberish,
    amount: BigNumberish,
    amount0: BigNumberish,
    amount1: BigNumberish
  ];
  export type OutputTuple = [
    owner: string,
    tickLower: bigint,
    tickUpper: bigint,
    amount: bigint,
    amount0: bigint,
    amount1: bigint
  ];
  export interface OutputObject {
    owner: string;
    tickLower: bigint;
    tickUpper: bigint;
    amount: bigint;
    amount0: bigint;
    amount1: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CollectEvent {
  export type InputTuple = [
    owner: AddressLike,
    recipient: AddressLike,
    tickLower: BigNumberish,
    tickUpper: BigNumberish,
    amount0: BigNumberish,
    amount1: BigNumberish
  ];
  export type OutputTuple = [
    owner: string,
    recipient: string,
    tickLower: bigint,
    tickUpper: bigint,
    amount0: bigint,
    amount1: bigint
  ];
  export interface OutputObject {
    owner: string;
    recipient: string;
    tickLower: bigint;
    tickUpper: bigint;
    amount0: bigint;
    amount1: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CollectProtocolEvent {
  export type InputTuple = [
    sender: AddressLike,
    recipient: AddressLike,
    amount0: BigNumberish,
    amount1: BigNumberish
  ];
  export type OutputTuple = [
    sender: string,
    recipient: string,
    amount0: bigint,
    amount1: bigint
  ];
  export interface OutputObject {
    sender: string;
    recipient: string;
    amount0: bigint;
    amount1: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace FlashEvent {
  export type InputTuple = [
    sender: AddressLike,
    recipient: AddressLike,
    amount0: BigNumberish,
    amount1: BigNumberish,
    paid0: BigNumberish,
    paid1: BigNumberish
  ];
  export type OutputTuple = [
    sender: string,
    recipient: string,
    amount0: bigint,
    amount1: bigint,
    paid0: bigint,
    paid1: bigint
  ];
  export interface OutputObject {
    sender: string;
    recipient: string;
    amount0: bigint;
    amount1: bigint;
    paid0: bigint;
    paid1: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace IncreaseObservationCardinalityNextEvent {
  export type InputTuple = [
    observationCardinalityNextOld: BigNumberish,
    observationCardinalityNextNew: BigNumberish
  ];
  export type OutputTuple = [
    observationCardinalityNextOld: bigint,
    observationCardinalityNextNew: bigint
  ];
  export interface OutputObject {
    observationCardinalityNextOld: bigint;
    observationCardinalityNextNew: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializeEvent {
  export type InputTuple = [sqrtPriceX96: BigNumberish, tick: BigNumberish];
  export type OutputTuple = [sqrtPriceX96: bigint, tick: bigint];
  export interface OutputObject {
    sqrtPriceX96: bigint;
    tick: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MintEvent {
  export type InputTuple = [
    sender: AddressLike,
    owner: AddressLike,
    tickLower: BigNumberish,
    tickUpper: BigNumberish,
    amount: BigNumberish,
    amount0: BigNumberish,
    amount1: BigNumberish
  ];
  export type OutputTuple = [
    sender: string,
    owner: string,
    tickLower: bigint,
    tickUpper: bigint,
    amount: bigint,
    amount0: bigint,
    amount1: bigint
  ];
  export interface OutputObject {
    sender: string;
    owner: string;
    tickLower: bigint;
    tickUpper: bigint;
    amount: bigint;
    amount0: bigint;
    amount1: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SetFeeProtocolEvent {
  export type InputTuple = [
    feeProtocol0Old: BigNumberish,
    feeProtocol1Old: BigNumberish,
    feeProtocol0New: BigNumberish,
    feeProtocol1New: BigNumberish
  ];
  export type OutputTuple = [
    feeProtocol0Old: bigint,
    feeProtocol1Old: bigint,
    feeProtocol0New: bigint,
    feeProtocol1New: bigint
  ];
  export interface OutputObject {
    feeProtocol0Old: bigint;
    feeProtocol1Old: bigint;
    feeProtocol0New: bigint;
    feeProtocol1New: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SwapEvent {
  export type InputTuple = [
    sender: AddressLike,
    recipient: AddressLike,
    amount0: BigNumberish,
    amount1: BigNumberish,
    sqrtPriceX96: BigNumberish,
    liquidity: BigNumberish,
    tick: BigNumberish
  ];
  export type OutputTuple = [
    sender: string,
    recipient: string,
    amount0: bigint,
    amount1: bigint,
    sqrtPriceX96: bigint,
    liquidity: bigint,
    tick: bigint
  ];
  export interface OutputObject {
    sender: string;
    recipient: string;
    amount0: bigint;
    amount1: bigint;
    sqrtPriceX96: bigint;
    liquidity: bigint;
    tick: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface UniswapV3Pool extends BaseContract {
  connect(runner?: ContractRunner | null): UniswapV3Pool;
  waitForDeployment(): Promise<this>;

  interface: UniswapV3PoolInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  burn: TypedContractMethod<
    [tickLower: BigNumberish, tickUpper: BigNumberish, amount: BigNumberish],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "nonpayable"
  >;

  collect: TypedContractMethod<
    [
      recipient: AddressLike,
      tickLower: BigNumberish,
      tickUpper: BigNumberish,
      amount0Requested: BigNumberish,
      amount1Requested: BigNumberish
    ],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "nonpayable"
  >;

  collectProtocol: TypedContractMethod<
    [
      recipient: AddressLike,
      amount0Requested: BigNumberish,
      amount1Requested: BigNumberish
    ],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "nonpayable"
  >;

  factory: TypedContractMethod<[], [string], "view">;

  fee: TypedContractMethod<[], [bigint], "view">;

  feeGrowthGlobal0X128: TypedContractMethod<[], [bigint], "view">;

  feeGrowthGlobal1X128: TypedContractMethod<[], [bigint], "view">;

  increaseObservationCardinalityNext: TypedContractMethod<
    [observationCardinalityNext: BigNumberish],
    [void],
    "nonpayable"
  >;

  initialize: TypedContractMethod<
    [sqrtPriceX96: BigNumberish],
    [void],
    "nonpayable"
  >;

  liquidity: TypedContractMethod<[], [bigint], "view">;

  maxLiquidityPerTick: TypedContractMethod<[], [bigint], "view">;

  mint: TypedContractMethod<
    [
      recipient: AddressLike,
      tickLower: BigNumberish,
      tickUpper: BigNumberish,
      amount: BigNumberish,
      data: BytesLike
    ],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "nonpayable"
  >;

  observations: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [bigint, bigint, bigint, boolean] & {
        blockTimestamp: bigint;
        tickCumulative: bigint;
        secondsPerLiquidityCumulativeX128: bigint;
        initialized: boolean;
      }
    ],
    "view"
  >;

  observe: TypedContractMethod<
    [secondsAgos: BigNumberish[]],
    [
      [bigint[], bigint[]] & {
        tickCumulatives: bigint[];
        secondsPerLiquidityCumulativeX128s: bigint[];
      }
    ],
    "view"
  >;

  positions: TypedContractMethod<
    [arg0: BytesLike],
    [
      [bigint, bigint, bigint, bigint, bigint] & {
        liquidity: bigint;
        feeGrowthInside0LastX128: bigint;
        feeGrowthInside1LastX128: bigint;
        tokensOwed0: bigint;
        tokensOwed1: bigint;
      }
    ],
    "view"
  >;

  protocolFees: TypedContractMethod<
    [],
    [[bigint, bigint] & { token0: bigint; token1: bigint }],
    "view"
  >;

  setFeeProtocol: TypedContractMethod<
    [feeProtocol0: BigNumberish, feeProtocol1: BigNumberish],
    [void],
    "nonpayable"
  >;

  slot0: TypedContractMethod<
    [],
    [
      [bigint, bigint, bigint, bigint, bigint, bigint, boolean] & {
        sqrtPriceX96: bigint;
        tick: bigint;
        observationIndex: bigint;
        observationCardinality: bigint;
        observationCardinalityNext: bigint;
        feeProtocol: bigint;
        unlocked: boolean;
      }
    ],
    "view"
  >;

  snapshotCumulativesInside: TypedContractMethod<
    [tickLower: BigNumberish, tickUpper: BigNumberish],
    [
      [bigint, bigint, bigint] & {
        tickCumulativeInside: bigint;
        secondsPerLiquidityInsideX128: bigint;
        secondsInside: bigint;
      }
    ],
    "view"
  >;

  swap: TypedContractMethod<
    [
      recipient: AddressLike,
      zeroForOne: boolean,
      amountSpecified: BigNumberish,
      sqrtPriceLimitX96: BigNumberish,
      data: BytesLike
    ],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "nonpayable"
  >;

  tickBitmap: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;

  tickSpacing: TypedContractMethod<[], [bigint], "view">;

  ticks: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [bigint, bigint, bigint, bigint, bigint, bigint, bigint, boolean] & {
        liquidityGross: bigint;
        liquidityNet: bigint;
        feeGrowthOutside0X128: bigint;
        feeGrowthOutside1X128: bigint;
        tickCumulativeOutside: bigint;
        secondsPerLiquidityOutsideX128: bigint;
        secondsOutside: bigint;
        initialized: boolean;
      }
    ],
    "view"
  >;

  token0: TypedContractMethod<[], [string], "view">;

  token1: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "burn"
  ): TypedContractMethod<
    [tickLower: BigNumberish, tickUpper: BigNumberish, amount: BigNumberish],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "collect"
  ): TypedContractMethod<
    [
      recipient: AddressLike,
      tickLower: BigNumberish,
      tickUpper: BigNumberish,
      amount0Requested: BigNumberish,
      amount1Requested: BigNumberish
    ],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "collectProtocol"
  ): TypedContractMethod<
    [
      recipient: AddressLike,
      amount0Requested: BigNumberish,
      amount1Requested: BigNumberish
    ],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "factory"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "fee"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "feeGrowthGlobal0X128"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "feeGrowthGlobal1X128"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "increaseObservationCardinalityNext"
  ): TypedContractMethod<
    [observationCardinalityNext: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<[sqrtPriceX96: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "liquidity"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxLiquidityPerTick"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "mint"
  ): TypedContractMethod<
    [
      recipient: AddressLike,
      tickLower: BigNumberish,
      tickUpper: BigNumberish,
      amount: BigNumberish,
      data: BytesLike
    ],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "observations"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [bigint, bigint, bigint, boolean] & {
        blockTimestamp: bigint;
        tickCumulative: bigint;
        secondsPerLiquidityCumulativeX128: bigint;
        initialized: boolean;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "observe"
  ): TypedContractMethod<
    [secondsAgos: BigNumberish[]],
    [
      [bigint[], bigint[]] & {
        tickCumulatives: bigint[];
        secondsPerLiquidityCumulativeX128s: bigint[];
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "positions"
  ): TypedContractMethod<
    [arg0: BytesLike],
    [
      [bigint, bigint, bigint, bigint, bigint] & {
        liquidity: bigint;
        feeGrowthInside0LastX128: bigint;
        feeGrowthInside1LastX128: bigint;
        tokensOwed0: bigint;
        tokensOwed1: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "protocolFees"
  ): TypedContractMethod<
    [],
    [[bigint, bigint] & { token0: bigint; token1: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "setFeeProtocol"
  ): TypedContractMethod<
    [feeProtocol0: BigNumberish, feeProtocol1: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "slot0"
  ): TypedContractMethod<
    [],
    [
      [bigint, bigint, bigint, bigint, bigint, bigint, boolean] & {
        sqrtPriceX96: bigint;
        tick: bigint;
        observationIndex: bigint;
        observationCardinality: bigint;
        observationCardinalityNext: bigint;
        feeProtocol: bigint;
        unlocked: boolean;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "snapshotCumulativesInside"
  ): TypedContractMethod<
    [tickLower: BigNumberish, tickUpper: BigNumberish],
    [
      [bigint, bigint, bigint] & {
        tickCumulativeInside: bigint;
        secondsPerLiquidityInsideX128: bigint;
        secondsInside: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "swap"
  ): TypedContractMethod<
    [
      recipient: AddressLike,
      zeroForOne: boolean,
      amountSpecified: BigNumberish,
      sqrtPriceLimitX96: BigNumberish,
      data: BytesLike
    ],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "tickBitmap"
  ): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "tickSpacing"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "ticks"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [bigint, bigint, bigint, bigint, bigint, bigint, bigint, boolean] & {
        liquidityGross: bigint;
        liquidityNet: bigint;
        feeGrowthOutside0X128: bigint;
        feeGrowthOutside1X128: bigint;
        tickCumulativeOutside: bigint;
        secondsPerLiquidityOutsideX128: bigint;
        secondsOutside: bigint;
        initialized: boolean;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "token0"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "token1"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "Burn"
  ): TypedContractEvent<
    BurnEvent.InputTuple,
    BurnEvent.OutputTuple,
    BurnEvent.OutputObject
  >;
  getEvent(
    key: "Collect"
  ): TypedContractEvent<
    CollectEvent.InputTuple,
    CollectEvent.OutputTuple,
    CollectEvent.OutputObject
  >;
  getEvent(
    key: "CollectProtocol"
  ): TypedContractEvent<
    CollectProtocolEvent.InputTuple,
    CollectProtocolEvent.OutputTuple,
    CollectProtocolEvent.OutputObject
  >;
  getEvent(
    key: "Flash"
  ): TypedContractEvent<
    FlashEvent.InputTuple,
    FlashEvent.OutputTuple,
    FlashEvent.OutputObject
  >;
  getEvent(
    key: "IncreaseObservationCardinalityNext"
  ): TypedContractEvent<
    IncreaseObservationCardinalityNextEvent.InputTuple,
    IncreaseObservationCardinalityNextEvent.OutputTuple,
    IncreaseObservationCardinalityNextEvent.OutputObject
  >;
  getEvent(
    key: "Initialize"
  ): TypedContractEvent<
    InitializeEvent.InputTuple,
    InitializeEvent.OutputTuple,
    InitializeEvent.OutputObject
  >;
  getEvent(
    key: "Mint"
  ): TypedContractEvent<
    MintEvent.InputTuple,
    MintEvent.OutputTuple,
    MintEvent.OutputObject
  >;
  getEvent(
    key: "SetFeeProtocol"
  ): TypedContractEvent<
    SetFeeProtocolEvent.InputTuple,
    SetFeeProtocolEvent.OutputTuple,
    SetFeeProtocolEvent.OutputObject
  >;
  getEvent(
    key: "Swap"
  ): TypedContractEvent<
    SwapEvent.InputTuple,
    SwapEvent.OutputTuple,
    SwapEvent.OutputObject
  >;

  filters: {
    "Burn(address,int24,int24,uint128,uint256,uint256)": TypedContractEvent<
      BurnEvent.InputTuple,
      BurnEvent.OutputTuple,
      BurnEvent.OutputObject
    >;
    Burn: TypedContractEvent<
      BurnEvent.InputTuple,
      BurnEvent.OutputTuple,
      BurnEvent.OutputObject
    >;

    "Collect(address,address,int24,int24,uint128,uint128)": TypedContractEvent<
      CollectEvent.InputTuple,
      CollectEvent.OutputTuple,
      CollectEvent.OutputObject
    >;
    Collect: TypedContractEvent<
      CollectEvent.InputTuple,
      CollectEvent.OutputTuple,
      CollectEvent.OutputObject
    >;

    "CollectProtocol(address,address,uint128,uint128)": TypedContractEvent<
      CollectProtocolEvent.InputTuple,
      CollectProtocolEvent.OutputTuple,
      CollectProtocolEvent.OutputObject
    >;
    CollectProtocol: TypedContractEvent<
      CollectProtocolEvent.InputTuple,
      CollectProtocolEvent.OutputTuple,
      CollectProtocolEvent.OutputObject
    >;

    "Flash(address,address,uint256,uint256,uint256,uint256)": TypedContractEvent<
      FlashEvent.InputTuple,
      FlashEvent.OutputTuple,
      FlashEvent.OutputObject
    >;
    Flash: TypedContractEvent<
      FlashEvent.InputTuple,
      FlashEvent.OutputTuple,
      FlashEvent.OutputObject
    >;

    "IncreaseObservationCardinalityNext(uint16,uint16)": TypedContractEvent<
      IncreaseObservationCardinalityNextEvent.InputTuple,
      IncreaseObservationCardinalityNextEvent.OutputTuple,
      IncreaseObservationCardinalityNextEvent.OutputObject
    >;
    IncreaseObservationCardinalityNext: TypedContractEvent<
      IncreaseObservationCardinalityNextEvent.InputTuple,
      IncreaseObservationCardinalityNextEvent.OutputTuple,
      IncreaseObservationCardinalityNextEvent.OutputObject
    >;

    "Initialize(uint160,int24)": TypedContractEvent<
      InitializeEvent.InputTuple,
      InitializeEvent.OutputTuple,
      InitializeEvent.OutputObject
    >;
    Initialize: TypedContractEvent<
      InitializeEvent.InputTuple,
      InitializeEvent.OutputTuple,
      InitializeEvent.OutputObject
    >;

    "Mint(address,address,int24,int24,uint128,uint256,uint256)": TypedContractEvent<
      MintEvent.InputTuple,
      MintEvent.OutputTuple,
      MintEvent.OutputObject
    >;
    Mint: TypedContractEvent<
      MintEvent.InputTuple,
      MintEvent.OutputTuple,
      MintEvent.OutputObject
    >;

    "SetFeeProtocol(uint8,uint8,uint8,uint8)": TypedContractEvent<
      SetFeeProtocolEvent.InputTuple,
      SetFeeProtocolEvent.OutputTuple,
      SetFeeProtocolEvent.OutputObject
    >;
    SetFeeProtocol: TypedContractEvent<
      SetFeeProtocolEvent.InputTuple,
      SetFeeProtocolEvent.OutputTuple,
      SetFeeProtocolEvent.OutputObject
    >;

    "Swap(address,address,int256,int256,uint160,uint128,int24)": TypedContractEvent<
      SwapEvent.InputTuple,
      SwapEvent.OutputTuple,
      SwapEvent.OutputObject
    >;
    Swap: TypedContractEvent<
      SwapEvent.InputTuple,
      SwapEvent.OutputTuple,
      SwapEvent.OutputObject
    >;
  };
}
