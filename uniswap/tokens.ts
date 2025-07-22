import {Token} from "@/models/models";

export async function getTokens(): Promise<Token[]> {
    return [
        { symbol: "USDC", name: "USD Coin", address: "0x8346d72233072a255c13fe3f16adb8b7055d5eaf", decimals: 6, nativePrice: 0.9},
        { symbol: "ETH", name: "Ethereum", address: "0x08a19ce4b93e957add175f61e022b81894e66720", decimals: 18, nativePrice: 1 },
        { symbol: "BTC", name: "Bitcoin",  address: "0xdf4bdac4ba259127d1c53c07cdd005ad54ccafb0", decimals: 8, nativePrice: 1.1 },
    ]
}