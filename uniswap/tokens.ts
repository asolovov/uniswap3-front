import { UserToken } from "@/models/models";
import { getTokensFromGraphQL } from "@/packages/gql/tokens";
import { TOKENS_MOCKED } from "@/uniswap/mockedData";

export async function getTokens(): Promise<UserToken[]> {
  try {
    return await getTokensFromGraphQL();
  } catch (error) {
    console.error("Error fetching tokens from GraphQL:", error);
  }
  return TOKENS_MOCKED;
}
