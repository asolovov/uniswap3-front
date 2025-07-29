'use client'

import PayTokenSection from "./PayTokenSection";
import ReceiveTokenSection from "./ReceiveTokenSection";
import SwapTokenPositions from "@/app/swap/_components/SwapCard/SwapSection/SwapTokenPositions";
import ExchangeRate from "@/app/swap/_components/SwapCard/SwapSection/ExchangeRate";
import TransactionDetails from "./TransactionDetails";
import {useAccount} from "wagmi";
import ConnectButton from "@/app/swap/_components/ConnectButton";
import SwapButton from "@/app/swap/_components/SwapCard/SwapSection/SwapButton";

export default function SwapSection() {
    const { isConnected } = useAccount();

    return (
        <div className="space-y-4">
            <PayTokenSection/>
            <SwapTokenPositions/>
            <ReceiveTokenSection/>
            <ExchangeRate/>
            <TransactionDetails/>

            {isConnected ? (
                <SwapButton/>
            ) : (
                <ConnectButton/>
            )}
        </div>
    )
}