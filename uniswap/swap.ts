import { UserToken } from "@/models/models"

export async function executeSwap (
    payToken: UserToken,
    receiveToken: UserToken,
    payAmount: string,
    slippage: number,
    validity: number,
): Promise<boolean> {
    // Mock transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock success
    return true
}