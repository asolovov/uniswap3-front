import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {AlertTriangle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useSwapStore} from "@/app/swap/_store/swapProvider";

export default function ErrorModal() {
    const {errMessage, setErrMessage} = useSwapStore()

    return (
        <Dialog open={errMessage !== null} onOpenChange={(v) => {
            if (!v) setErrMessage(null)
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        Transaction Failed
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-red-50 rounded-lg p-4">
                        <div className="text-sm text-red-800">{errMessage?.message}</div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            setErrMessage(null);
                        }}
                        className="w-full"
                        variant="outline"
                    >
                        Try Again
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}