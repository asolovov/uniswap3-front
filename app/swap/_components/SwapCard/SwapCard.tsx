'use client'

import {Card, CardContent} from "@/components/ui/card";
import SwapSettings from "@/app/swap/_components/SwapCard/SwapSettings/SwapSettings";
import SwapSection from "@/app/swap/_components/SwapCard/SwapSection/SwapSection";

export default function SwapCard() {
    return (
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold">Swap</h1>
                    <SwapSettings/>
                </div>

                <SwapSection/>
            </CardContent>
        </Card>

    )
}