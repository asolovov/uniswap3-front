import { createConfig, http } from "wagmi";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";

import { zephyr } from "./chain";
import { WAGMI_CONFIG } from "./app";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Connect",
      wallets: [metaMaskWallet],
    },
  ],
  {
    appName: "MSFT",
    projectId: WAGMI_CONFIG.PROJECT_ID,
  }
);

export const config = createConfig({
  connectors,
  chains: [zephyr],
  transports: { [zephyr.id]: http() },
  ssr: true,
});
