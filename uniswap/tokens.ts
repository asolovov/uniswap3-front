import {UserToken} from "@/models/models";
import {TOKENS_MOCKED} from "@/uniswap/mockedData";

export async function getTokens(): Promise<UserToken[]> {
    return TOKENS_MOCKED
}