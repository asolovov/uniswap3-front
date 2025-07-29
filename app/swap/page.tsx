import SwapClient from "@/app/swap/Swap.client";
import {SwapProvider} from "@/app/swap/_store/swapProvider";
import {getTokens} from "@/uniswap/tokens";
import {UserToken} from "@/models/models";

export default async function SwapPage() {
    let tokens: UserToken[] = []
    try {
        tokens = await getTokens();
    } catch (e) {
        console.error("err fetch tokens: " + e)
    }

    return (
        <SwapProvider initialTokens={tokens}>
            <SwapClient/>
        </SwapProvider>
    )
}