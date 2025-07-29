'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {AlertTriangle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useSwapStore} from "@/app/swap/_store/swapProvider";
import {useEthersSigner} from "@/packages/uniswap/contracts/signer";
import {approveAllowance, METHOD} from "@/uniswap/allowance";

export default function AllowanceModal() {
    const {
        payToken, payAmount,
        isShowAllowanceModal, setIsShowAllowanceModal,
        isApprovingAllowance, setIsApprovingAllowance,
        setErrMessage, setIsShowSwapModal
    } = useSwapStore()
    const signer = useEthersSigner();

    const handleApproveAllowance = async () => {
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

        try {
          setIsApprovingAllowance(true);

          const success = await approveAllowance(
            payToken,
            payAmount,
            signer,
            METHOD.SWAP
          );

          if (success) {
            setIsShowSwapModal(true);
          }
        } catch (error) {
          console.error("Error approving allowance:", error);
          setErrMessage({message: "Error approving allowance. Please try again."});
          return
        } finally {
          setIsApprovingAllowance(false);
          setIsShowAllowanceModal(false);
        }
    }

    return (
        <Dialog open={isShowAllowanceModal} onOpenChange={setIsShowAllowanceModal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Allowance Required
                    </DialogTitle>
                    <DialogDescription className="text-left">
                        You need to give permission for the Uniswap protocol to spend your{" "}
                        {payToken?.symbol} tokens. This is a one-time transaction that
                        allows the protocol to access your tokens for trading.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Token to approve:</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{payToken?.symbol}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium">
                  {payAmount} {payToken?.symbol}
                </span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        This transaction will require gas fees.
                    </div>
                </div>
                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsShowAllowanceModal(false)}
                        disabled={isApprovingAllowance}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApproveAllowance}
                        disabled={isApprovingAllowance}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                        {isApprovingAllowance ? "Approving..." : "Approve & Swap"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}