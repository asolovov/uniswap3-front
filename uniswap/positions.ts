import {UserToken, UserPosition, FEE_TIER} from "@/models/models";
import {MintOptions, Pool, Position} from "@uniswap/v3-sdk";
import {POSITIONS_MOCKED, UNI_POOL_MOCKED} from "@/uniswap/mockedData";

export interface TickAndPrice {
    tick: number,
    price: string,
}

export async function getUserPositions(): Promise<UserPosition[]> {
    return POSITIONS_MOCKED
}

// TODO: next steps -> create pool; for now return pool not exist error
// pool is created after tokens select and fee tier select (should change!!)

export async function getPool(tokenA: UserToken, tokenB: UserToken, feeTier: FEE_TIER): Promise<Pool> {
    return UNI_POOL_MOCKED
}

// price always token 1 in token 0 (price = price1 / price 0)

export async function getNearestTickAndPrice(
    price: string, tickSpacing: number,
): Promise<TickAndPrice> {
    const newPrice = Number.parseFloat(price) * 0.9987654
    return {
        tick: newPrice,
        price: newPrice.toString()
    }
}

// +
export function getNextTickAndPrice(
    tick: number,
    tickSpacing: number
): { tick: number; price: string } {
    const newPrice = tick + (tickSpacing / 1000)

    return {
        tick: newPrice,
        price: newPrice.toString()
    }
}

// -
export function getPrevTickAndPrice(
    tick: number,
    tickSpacing: number
): { tick: number; price: string } {
    const newPrice = tick - (tickSpacing / 1000)

    return {
        tick: newPrice,
        price: newPrice.toString()
    }
}

export function getPositionFromInput(
    amount0: string,
    amount1: string,
    pool: Pool,
    tickLower: number,
    tickUpper: number
): Position {
    return new Position({pool, liquidity: "", tickLower, tickUpper})
}

export function getMintCalldata(
    positionToMint: Position,
    options: MintOptions
): { calldata: string; value: string } {
    return {calldata: "", value: ""}
}