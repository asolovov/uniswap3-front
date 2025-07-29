'use client'

import {Input} from "@/components/ui/input";

export default function AmountInput({amount, setAmount, disabled}: { amount: string, setAmount: (amount: string) => void, disabled: boolean}) {
    return (
        <Input
            type="number"
            lang={"en-US"}
            placeholder="0"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border-0 bg-transparent font-semibold p-0 h-auto md:text-2xl"
            step="any"
            disabled={disabled}
        />
    )
}