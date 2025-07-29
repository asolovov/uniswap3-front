'use client'

import {Label} from "@/components/ui/label";
import AmountInput from "@/app/swap/_components/AmountInput";
import TokenSelect from "@/app/swap/_components/TokenSelect";
import {getUSDCAmount} from "@/lib/utils";
import {useSwapStore} from "@/app/swap/_store/swapProvider";

export default function PayTokenSection() {
    const {
        getTokens, usdcNativePrice,
        payAmount, payToken, receiveToken,
        setPayAmount, setPayTokenBySymbol,
    } = useSwapStore()

    return (
        <div className="bg-gray-50 rounded-xl p-4">
            <Label className="text-sm text-gray-600 mb-2 block">
                You pay
            </Label>
            <div className="flex items-center gap-3">
                <AmountInput amount={payAmount} setAmount={setPayAmount} disabled={!payToken || !receiveToken}/>
                <TokenSelect token={payToken} setToken={setPayTokenBySymbol} tokens={getTokens().filter(
                    t => t?.symbol !== receiveToken?.symbol)
                }/>
            </div>
            {payAmount && payToken && (
                <div className="text-sm text-gray-500 mt-2">
                    {getUSDCAmount(payAmount, payToken, usdcNativePrice)} USDC
                </div>
            )}
        </div>
    )
}