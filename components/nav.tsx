import React from "react";
import NavWallet from "@/components/nav-wallet";
import NavButtons from "@/components/nav-buttons";

export default function Nav() {
    return (
        <nav className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">G</span>
                    </div>
                    <span className="font-semibold text-lg">Gateway-Swap</span>
                </div>
                <NavButtons/>
            </div>
            <NavWallet/>
        </nav>
    )
}