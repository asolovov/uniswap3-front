import { Token } from "@/models/models"

// export async function recalculateAmount(
//     payToken: Token,
//     receiveToken: Token,
//     payAmount: string,
//     receiveAmount: string,
// ): Promise<{ newPayAmount: string, newReceiveAmount: string}> {
//     return {newPayAmount: payAmount, newReceiveAmount: receiveAmount}
// }

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