import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {UserToken} from "@/models/models";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUSDCAmount = (amount: string, token: UserToken, usdcNativePrice: number) => {
  if (token.symbol === "USDC") {
    return amount;
  }

  const rate = token.nativePrice / usdcNativePrice;
  return (Number.parseFloat(amount) * rate).toString();
};

