'use client'

import {Label} from "@/components/ui/label";
import {AlertTriangle, Info} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useSwapStore} from "@/app/swap/_store/swapProvider";

export default function SwapSettingsValidity() {
    const {validity, validityWarning, setValidity} = useSwapStore()

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Label className="text-sm">
                    Transaction validity period
                </Label>
                <Info className="w-3 h-3 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    value={validity}
                    onChange={(e) => setValidity(Number.parseInt(e.target.value))}
                    className="flex-1"
                    min="1"
                    lang={"en"}
                />
                <span className="text-sm text-gray-500">minutes</span>
            </div>
            {validityWarning && (
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                        {validityWarning}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}