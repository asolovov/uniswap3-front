'use client'

import {createSwapStore} from "@/app/swap/_store/swapStore";
import {createContext, ReactNode, useContext, useState} from "react";
import {useStore} from "zustand/react";
import {UserToken} from "@/models/models";

export const SwapCtx = createContext<ReturnType<typeof createSwapStore> | null>(null);

export function SwapProvider(
    {
        initialTokens,
        children,
    }: {
        initialTokens: UserToken[];
        children: ReactNode;
    }
) {
    let usdcNativePrice = 0;
    const tokensMap = Object.fromEntries(initialTokens.map(t => {
        if (t.symbol === "USDC") {
            usdcNativePrice = t.nativePrice;
        }
        return [t.symbol, t]
    }));

    const [store] = useState(() => createSwapStore(tokensMap, usdcNativePrice, new Date()));

    return <SwapCtx.Provider value={store}>{children}</SwapCtx.Provider>;
}

export const useSwapStore = () => {
    const ctx = useContext(SwapCtx)
    if (!ctx) throw new Error('useSwapStore must be inside <SwapProvider>');
    return useStore(ctx)
}
