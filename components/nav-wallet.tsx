'use client'

import {Button} from "@/components/ui/button";
import React from "react";

const mockedWallet = "0x8382Be7cc5C2Cd8b14F44108444ced6745c5feCb";

const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};


export default function NavWallet() {
    const [isConnected, setIsConnected] = React.useState(false);

    const handleWalletConnect = () => {
        setIsConnected(!isConnected);
    }

    return (
        <div className="flex items-center gap-3">
            {isConnected ? (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">{formatWalletAddress(mockedWallet)}</span>
                    <Button variant="outline" size="sm" onClick={handleWalletConnect}>
                        Disconnect
                    </Button>
                </div>
            ) : (
                <Button onClick={handleWalletConnect}>Connect</Button>
            )}
        </div>
    )
}