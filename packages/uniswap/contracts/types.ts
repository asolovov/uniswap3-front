import { Abi } from "viem";

export type CoreContract<A extends Abi, Addr extends `0x${string}`> = {
  abi: A;
  address: Addr;
};

export type ContractInstance<A extends Abi> = {
  abi: A;
};
