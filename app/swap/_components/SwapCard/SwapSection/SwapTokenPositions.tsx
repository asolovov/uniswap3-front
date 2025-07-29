'use client'

import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import {useSwapStore} from "@/app/swap/_store/swapProvider";

export default function SwapTokenPositions() {
    const {payToken, receiveToken, receiveAmount, setPayToken, setReceiveToken, setPayAmount} = useSwapStore()

    const handleSwapTokenPositions = () => {
        const temp = payToken;
        setPayToken(receiveToken);
        setReceiveToken(temp);
        setPayAmount(receiveAmount);
    }

    return (
        <div className="flex justify-center">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleSwapTokenPositions}
                className="rounded-full p-2 border bg-white hover:bg-gray-50"
            >
                <ArrowUpDown className="w-4 h-4" />
            </Button>
        </div>

    )
}
