'use client'

import {Label} from "@/components/ui/label";
import {AlertTriangle, Info} from "lucide-react";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Input} from "@/components/ui/input";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useSwapStore} from "@/app/swap/_store/swapProvider";

export default function SwapSettingsSlippage() {
    const {slippageMode, slippage, slippageWarning, setSlippageMode, setSlippage} = useSwapStore()

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Label className="text-sm">Max slippage</Label>
                <Info className="w-3 h-3 text-gray-400"/>
            </div>
            <Tabs
                value={slippageMode}
                onValueChange={(v) => {
                    setSlippageMode(v as "auto" | "custom")
                    if (v === "auto") setSlippage(5.5)
                }}
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="auto">Auto</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
            </Tabs>
            {slippageMode === "custom" && (
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="5.5"
                        value={slippage}
                        onChange={(e) => setSlippage(Number.parseFloat(e.target.value))}
                        className="flex-1"
                        min="0"
                        max="100"
                        step="0.1"
                        lang={"en-EN"}
                    />
                    <span className="text-sm text-gray-500">%</span>
                </div>
            )}
            {slippageWarning && (
                <Alert variant={slippageWarning.variant}>
                    <AlertTriangle className="h-4 w-4"/>
                    <AlertDescription className="text-sm">
                        {slippageWarning.message}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}