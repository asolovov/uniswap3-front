import { Chain } from "@rainbow-me/rainbowkit";

import { CHAIN_CONFIG } from "./app";

export const zephyr: Chain = {
  id: CHAIN_CONFIG.CHAIN_ID,
  name: "zephyr",
  nativeCurrency: {
    name: "Zero",
    symbol: "Z",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [CHAIN_CONFIG.RPC],
    },
    public: {
      http: [CHAIN_CONFIG.RPC],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockexplorer",
      url: CHAIN_CONFIG.BLOCKSCOUT_URL,
    },
  },
  testnet: true,
};
