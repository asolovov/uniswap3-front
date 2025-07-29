'use client'

import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {UserToken} from "@/models/models";

export default function TokenSelect({token, setToken, tokens}: { token: UserToken | null, setToken: (token: string) => void, tokens: UserToken[]}) {
    return (
        <Select value={token?.symbol} onValueChange={setToken}>
            <SelectTrigger className="w-auto border-0 bg-white rounded-full px-3 py-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{token?.symbol}</span>
                </div>
            </SelectTrigger>
            <SelectContent>
                {tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                            <span>{token.symbol}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

    )
}