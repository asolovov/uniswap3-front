import {Token} from "@/models/models";

export async function checkAllowance (token: Token, amount: string): Promise<boolean> {
    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock logic: randomly return true/false for demonstration
    // In real implementation, this would check the actual allowance
    return Math.random() > 0.5
}

export enum METHOD {
    SWAP = "swap",
    POSITION = "position",
}

export async function approveAllowance (token: Token, method: METHOD, amount: string): Promise<boolean> {
    // Mock transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock success (in real implementation, this could fail)
    return true
}