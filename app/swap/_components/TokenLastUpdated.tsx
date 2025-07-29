'use client'

import {useEffect, useState} from "react";
import {useSwapStore} from "@/app/swap/_store/swapProvider";

export default function TokenLastUpdated() {
    const {tokenLastUpdated} = useSwapStore()
    const [, forceRerender] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            forceRerender(n => n + 1);
        }, 1_000);

        return () => clearInterval(id);
    }, []);

    const secondsAgo = Math.floor((Date.now() - tokenLastUpdated.getTime()) / 1_000);

    return (
        <span className="text-xs text-gray-400">
      Updated {secondsAgo}s ago
    </span>
    );
}