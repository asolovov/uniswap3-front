"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import React from "react";

const formatWalletAddress = (address?: string) => {
  address = address || "0x0000000000000000000000000000000000000000";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function NavWallet() {
  const { address, isConnected } = useAccount();

  return (
    <div className="flex items-center gap-3">
      <ConnectButton.Custom>
        {({ openAccountModal, openConnectModal }) => {
          return isConnected ? (
            <Button onClick={openAccountModal}>
              {formatWalletAddress(address)}
            </Button>
          ) : (
            <Button onClick={openConnectModal}>{"Connect Wallet"}</Button>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
