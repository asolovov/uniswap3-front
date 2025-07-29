'use client'

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Settings} from "lucide-react";
import SwapSettingsSlippage from "@/app/swap/_components/SwapCard/SwapSettings/SwapSettingsSlippage";
import SwapSettingsValidity from "@/app/swap/_components/SwapCard/SwapSettings/SwapSettingsValidity";
import {useSwapStore} from "@/app/swap/_store/swapProvider";

export default function SwapSettings() {
    const {isSwapSettingsOpen, setSwapSettingsOpen} = useSwapStore()

    return (
        <Popover open={isSwapSettingsOpen} onOpenChange={setSwapSettingsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                    <Settings className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    <h3 className="font-medium">Transaction Settings</h3>
                    <SwapSettingsSlippage/>
                    <SwapSettingsValidity/>
                </div>
            </PopoverContent>
        </Popover>
    )
}