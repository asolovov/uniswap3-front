import { Token } from "@/models/models"

export async function executeSwap (
    payToken: Token,
    receiveToken: Token,
    payAmount: string,
    slippage: number,
    validity: number,
): Promise<boolean> {
    // Mock transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock success
    return true
}