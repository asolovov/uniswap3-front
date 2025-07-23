export const API_CONFIG = {
  URL: process.env.NEXT_PUBLIC_API_URL,
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || "v1",
  PATH: process.env.NEXT_PUBLIC_API_PATH || "/api",
  PROXY_ENABLED: process.env.NEXT_PUBLIC_API_PROXY_ENABLED === "true",
  PROXY_PATH: process.env.NEXT_PUBLIC_API_PROXY_PATH || "/api",
  QUERY: {
    RETRY: {
      COUNT: 1,
      DELAY: 1000,
    },
    CACHING: {
      STALE_TIME:
        Number(process.env.NEXT_PUBLIC_API_CACHE_STALE_TIME) || 5 * 60 * 1000, // 5 minutes
      GC_TIME:
        Number(process.env.NEXT_PUBLIC_API_CACHE_GC_TIME) || 10 * 60 * 1000, // 10 minutes
    },
  },
} as const;

export const WAGMI_CONFIG = {
  PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID || "",
} as const;

export const CHAIN_CONFIG = {
  BLOCKSCOUT_URL:
    process.env.NEXT_PUBLIC_BLOCKSCOUT_URL ||
    "https://zephyr-blockscout.eu-north-2.gateway.fm", // Default blockscout URL
  RPC:
    process.env.NEXT_PUBLIC_RPC || "https://zephyr-rpc.eu-north-2.gateway.fm", // Default RPC URL
  CHAIN_ID: Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 0,
} as const;

export const CONTRACTS_CONFIG = {
  NFT_MANAGER_ADDRESS:
    process.env.NEXT_PUBLIC_NFT_MANAGER_ADDRESS ||
    "0x684fB3F611fd294f305b3F58ba3be72cFa65b0b2",
  FACTORY_ADDRESS:
    process.env.NEXT_PUBLIC_FACTORY_ADDRESS ||
    "0xEB4F50E1879e9912Ff8FD73B20bCAd7F195c5EBD",
  SWAP_ROUTER_ADDRESS:
    process.env.NEXT_PUBLIC_SWAP_ROUTER_ADDRESS ||
    "0x881f1D82139635c9190976F390305764bdBdEF3D",
  QUOTER_ADDRESS:
    process.env.NEXT_PUBLIC_QUOTER_ADDRESS ||
    "0x49FC0204705C6E1F1A9458b78C3c9DB2c5Fe2717",
} as const;
