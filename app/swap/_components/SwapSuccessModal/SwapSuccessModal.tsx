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
import {CHAIN_CONFIG} from "@/config/app";
import { useSwapStore } from "../../_store/swapProvider";

export default function SwapSuccessModal() {
    const {
        isShowSwapSuccess, setIsShowSwapSuccess,
        txReceipt, setTxReceipt,
        payToken, receiveToken,
    } = useSwapStore()

    return (
        <Dialog open={isShowSwapSuccess} onOpenChange={setIsShowSwapSuccess}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        Swap Successful
                    </DialogTitle>
                    <DialogDescription>
                        Your swap has been completed successfully.
                    </DialogDescription>
                </DialogHeader>
                {txReceipt && (
                    <div className="space-y-4">
                        <div className="bg-green-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-green-800">Swapped:</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{txReceipt.payed}</span>
                                    <span className="text-lg">{payToken?.symbol}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-green-800">Received:</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{txReceipt.received}</span>
                                    <span className="text-lg">{receiveToken?.symbol}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-green-700">Fee chain:</span>
                                <span className="font-medium">{txReceipt.feeChain}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-green-700">Fee swap:</span>
                                <span className="font-medium">{txReceipt.feeSwap}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-sm font-medium mb-2">
                                Transaction Hash:
                            </div>
                            <div className="text-xs font-mono bg-white p-2 rounded border break-all">
                                {txReceipt.txHash}
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() =>
                                window.open(
                                    `${CHAIN_CONFIG.BLOCKSCOUT_URL}/tx/${txReceipt?.txHash}`,
                                    "_blank"
                                )
                            }
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                            View on Blockscout
                        </Button>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        onClick={() => {
                            setIsShowSwapSuccess(false);
                            setTxReceipt(null);
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}