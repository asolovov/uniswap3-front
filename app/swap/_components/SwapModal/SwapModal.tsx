'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useSwapStore} from "../../_store/swapProvider";
import {useEthersSigner} from "@/packages/uniswap/contracts/signer";
import {executeSwap, NoReceiptError} from "@/uniswap/swap";

export default function SwapModal() {
    const {
        isShowSwapModal, setIsShowSwapModal,
        payAmount, payToken,
        receiveAmount, receiveToken,
        slippage, estimateTxFeeUSDC, validity,
        isSwapping, setIsSwapping,
        setErrMessage,
        setPayAmount, setReceiveAmount,
        setIsShowSwapSuccess, setTxReceipt
    } = useSwapStore()
    const signer = useEthersSigner();

    const performSwap = async () => {
        if (!signer) {
            console.error("Signer is not available");
            setErrMessage({message: "Wallet connection error. Please reconnect and try again."});
            return;
        }

        if (!payToken) {
            console.error("Pay token is not available");
            setErrMessage({message: "Pay token is not available. Please refresh the page and try again."});
            return
        }

        if (!receiveToken) {
            console.error("Receive token is not available");
            setErrMessage({message: "Receive token is not available. Please refresh the page and try again."});
            return
        }

        try {
            setIsSwapping(true);

            const success = await executeSwap(
                payToken,
                receiveToken,
                payAmount,
                slippage,
                validity,
                signer
            );

            if (success) {
                setPayAmount("");
                setReceiveAmount("");
                setTxReceipt(success);
                setIsShowSwapSuccess(true);
            }
        } catch (error) {
            console.error("Error executing swap:", error);
            if (error === NoReceiptError) {
                setErrMessage({
                    message: `Error executing swap - receipt not found. Please check the transaction in the Blockscout.`
                });
            } else {
                setErrMessage({
                    message: `Error executing swap. Please try again.`
                });
            }
            // setShowErrorDialog(true);
        } finally {
            setIsSwapping(false);
            setIsShowSwapModal(false);
        }
    }

    return (
        <Dialog open={isShowSwapModal} onOpenChange={setIsShowSwapModal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Swap</DialogTitle>
                    <DialogDescription>
                        Review your swap details before proceeding.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">You pay:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{payAmount}</span>
                                <span className="text-lg">{payToken?.symbol}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">You receive:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{receiveAmount}</span>
                                <span className="text-lg">{receiveToken?.symbol}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Max slippage:</span>
                            <span className="font-medium">
                                {slippage}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Network cost:</span>
                            <span className="font-medium">~{estimateTxFeeUSDC} USDC</span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                        Output is estimated.
                    </div>
                </div>
                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsShowSwapModal(false)}
                        disabled={isSwapping}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={performSwap}
                        disabled={isSwapping}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                        {isSwapping ? "Swapping..." : "Confirm Swap"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}