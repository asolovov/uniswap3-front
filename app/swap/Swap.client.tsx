'use client'

import {useSwapStore} from "@/app/swap/_store/swapProvider";
import {useEffect} from "react";
import {getTokens} from "@/uniswap/tokens";
import SwapCard from "@/app/swap/_components/SwapCard/SwapCard";
import AllowanceModal from "@/app/swap/_components/AllowanceModal/AllowanceModal";
import SwapModal from "@/app/swap/_components/SwapModal/SwapModal";
import SwapSuccessModal from "@/app/swap/_components/SwapSuccessModal/SwapSuccessModal";
import ErrorModal from "@/app/swap/_components/ErrorModal/ErrorModal";

export default function SwapClient() {
    const {setTokens} = useSwapStore()

    useEffect(() => {
        const id = setInterval(() => {
            getTokens().then(t => setTokens(t)).catch(
                e => console.error("err fetch tokens: " + e)
            )
        }, 30_000)

        return () => clearInterval(id)
    }, [setTokens])

    return (
        <div className="flex justify-center items-start pt-20 px-4">
            <SwapCard/>
            <AllowanceModal/>
            <SwapModal/>
            <SwapSuccessModal/>
            <ErrorModal/>
        </div>
    )
}