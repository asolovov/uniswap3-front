// example query
import { gql } from "graphql-request";
import { graphQLClient } from "@/packages/gql/client";
import { UserToken } from "@/models/models";

const query = gql`
  query GetTokens {
    tokens {
      id
      symbol
      name
      tokenAddress
      derivedETH
      decimals
    }
  }
`;

type Token = {
  id: string;
  symbol: string;
  name: string;
  derivedETH: string;
  decimals: string;
};

type TokenResponse = {
  tokens: Token[];
};

export async function getTokensFromGraphQL() {
  const response = (await graphQLClient.request(query)) as TokenResponse;
  const tokens: UserToken[] = response.tokens.map((token: Token) => ({
    address: token.id,
    symbol: token.symbol,
    name: token.name,
    decimals: Number.parseInt(token.decimals),
    nativePrice: Number.parseFloat(token.derivedETH),
  }));
  return tokens;
}
