// lib/graphql.ts
import { GraphQLClient } from "graphql-request";

const endpoint =
  "https://api-zephyr-dex.platform-dev.gateway.fm/subgraphs/name/v3-tokens-mainnet";

export const graphQLClient = new GraphQLClient(endpoint);
