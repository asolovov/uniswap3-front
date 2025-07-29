'use client'

import {Button} from "@/components/ui/button";
import {useSwapStore} from "@/app/swap/_store/swapProvider";
import {useAccount} from "wagmi";
import {checkAllowance, METHOD} from "@/uniswap/allowance";

export default function SwapButton() {
    const { address, isConnected } = useAccount();
    const {
        payAmount, receiveAmount, payToken,
        isCheckingAllowance, isSwapping,
        setIsCheckingAllowance,
        setIsShowAllowanceModal, setIsShowSwapModal, setErrMessage
    } = useSwapStore()

    const handleSwap = async () => {
        if (!isConnected || !address || !payToken) {
            return
        }

        setIsCheckingAllowance(true);

        try {
            const hasAllowance = await checkAllowance(
                payToken,
                payAmount,
                address,
                METHOD.SWAP
            );

            setIsCheckingAllowance(false);

            if (!hasAllowance) {
                setIsShowAllowanceModal(true);
            } else {
                setIsShowSwapModal(true);
            }
        } catch (error) {
            console.error("Error checking allowance:", error);
            setIsCheckingAllowance(false);
            setErrMessage({message: "Error checking allowance. Please try again."});
        }
    }

    return (
        <Button
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl"
            disabled={!payAmount || !receiveAmount || isCheckingAllowance || isSwapping}
            onClick={handleSwap}
        >
            {isCheckingAllowance
                ? "Checking allowance..."
                : isSwapping
                    ? "Swapping..."
                    : "Swap"}
        </Button>

    )
}
