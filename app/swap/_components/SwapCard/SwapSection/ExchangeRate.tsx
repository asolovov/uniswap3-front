'use client'

import {useSwapStore} from "@/app/swap/_store/swapProvider";
import TokenLastUpdated from "../../TokenLastUpdated";

export default function ExchangeRate() {
    const {payToken, receiveToken} = useSwapStore()

    if (payToken && receiveToken && payToken.address !== receiveToken.address) {
        return (
            <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
            <span>
              1 {receiveToken.symbol} ={" "}
                {receiveToken.nativePrice / payToken.nativePrice}{" "}
                {payToken.symbol}
            </span>
                    <TokenLastUpdated/>
                </div>
            </div>
        )
    }

    return null
}
