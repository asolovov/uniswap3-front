"use client";

import { Label } from "@/components/ui/label";
import AmountInput from "@/app/swap/_components/AmountInput";
import TokenSelect from "@/app/swap/_components/TokenSelect";
import { getUSDCAmount } from "@/lib/utils";
import { useSwapStore } from "@/app/swap/_store/swapProvider";
import { useEffect } from "react";
import { getQuotedPrice } from "@/uniswap/swap";

export default function ReceiveTokenSection() {
  const {
    getTokens,
    usdcNativePrice,
    receiveAmount,
    payToken,
    receiveToken,
    payAmount,
    setReceiveAmount,
    setReceiveTokenBySymbol,
    setErrMessage,
  } = useSwapStore();

  useEffect(() => {
    if (payAmount && payToken && receiveToken) {
      if (payToken.nativePrice > 0 && receiveToken.nativePrice > 0) {
        const exchangeRate = payToken.nativePrice / receiveToken.nativePrice;
        const calculated = Number.parseFloat(payAmount) * exchangeRate;
        setReceiveAmount(calculated.toFixed(6));
      } else {
        getQuotedPrice(payToken, receiveToken)
          .then((price) => {
            const calculated = Number.parseFloat(payAmount) * price;
            setReceiveAmount(calculated.toFixed(6));
          })
          .catch((error) => {
            console.error("Error fetching quoted price:", error);
            setErrMessage({
              message: "Failed to fetch the exchange rate. No routes found.",
            });
            setReceiveAmount("");
          });
      }
    } else {
      setReceiveAmount("");
    }
  }, [payAmount, payToken, receiveToken]);

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <Label className="text-sm text-gray-600 mb-2 block">You receive</Label>
      <div className="flex items-center gap-3">
        <div className="flex-1 text-2xl font-semibold text-gray-900">
          {receiveAmount}
        </div>
        <TokenSelect
          token={receiveToken}
          setToken={setReceiveTokenBySymbol}
          tokens={getTokens().filter((t) => t?.symbol !== payToken?.symbol)}
        />
      </div>
      {receiveAmount && receiveToken && (
        <div className="text-sm text-gray-500 mt-2">
          {getUSDCAmount(receiveAmount, receiveToken, usdcNativePrice)} USDC
        </div>
      )}
    </div>
  );
}
