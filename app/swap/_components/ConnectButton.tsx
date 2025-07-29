'use client'

import {Button} from "@/components/ui/button";
import {useConnectModal} from "@rainbow-me/rainbowkit";

export default function ConnectButton() {
    const { openConnectModal } = useConnectModal();

    return (
        <Button
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl"
            onClick={openConnectModal}
        >
            Connect Wallet
        </Button>

    )
}