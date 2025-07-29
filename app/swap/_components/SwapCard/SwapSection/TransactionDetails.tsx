'use client'

import {useSwapStore} from "@/app/swap/_store/swapProvider";

export default function TransactionDetails() {
    const {payAmount, receiveAmount, slippage, estimateTxFeeUSDC} = useSwapStore()

    if (payAmount && receiveAmount) {
        return (
            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span>Max slippage</span>
                    <span>{slippage}%</span>
                </div>
                <div className="flex justify-between">
                    <span>Network cost</span>
                    <span className="flex items-center gap-1">
                            {estimateTxFeeUSDC} USDC
                  </span>
                </div>
            </div>
        )
    }

    return null
}
