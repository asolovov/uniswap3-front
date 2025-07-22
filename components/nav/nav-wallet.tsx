"use client";
import { useAccountModal, WalletButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import React from "react";

const formatWalletAddress = (address?: string) => {
  address = address || "0x0000000000000000000000000000000000000000";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function NavWallet() {
  const { openAccountModal } = useAccountModal();
  const { address, isConnected } = useAccount();

  return (
    <div className="flex items-center gap-3">
      <WalletButton.Custom wallet="metamask">
        {({ connect }) => {
          return isConnected ? (
            <Button onClick={openAccountModal}>
              {formatWalletAddress(address)}
            </Button>
          ) : (
            <Button onClick={connect}>{"Connect Wallet"}</Button>
          );
        }}
      </WalletButton.Custom>
    </div>
  );
}
