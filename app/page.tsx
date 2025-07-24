"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, ArrowUpDown, AlertTriangle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserToken } from "@/models/models";
import { getTokens } from "@/uniswap/tokens";
import { approveAllowance, checkAllowance, METHOD } from "@/uniswap/allowance";
import {executeSwap, NoReceiptError, TxData} from "@/uniswap/swap";
import { useExchangeRate } from "@/components/updates";
import LastUpdated from "@/components/lastUpdated";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEthersSigner } from "@/packages/uniswap/contracts/signer";
import {CHAIN_CONFIG} from "@/config/app";

// Global constants
const DEFAULT_SLIPPAGE = 5.5;
const DEFAULT_VALIDITY = 30; // 30 minutes
const EXCHANGE_RATE_UPDATE_INTERVAL = 30000; // 30 seconds

export default function SwapPage() {
  // Tokens state
  const [tokens, setTokens] = useState<UserToken[]>([]);
  const [usdcNativePrice, setUsdcNativePrice] = useState(0);

  // Wallet state
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const signer = useEthersSigner();

  //Error dialog
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Swap conformation
  const [showSwapConfirmation, setShowSwapConfirmation] = useState(false);

  // Swap form state
  const [payToken, setPayToken] = useState(
    tokens.length > 0 ? tokens[0] : ({} as UserToken)
  );
  const [receiveToken, setReceiveToken] = useState(
    tokens.length > 0 ? tokens[1] : ({} as UserToken)
  );
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  // Settings state
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  const [customSlippage, setCustomSlippage] = useState("");
  const [slippageInput, setSlippageInput] = useState(`${DEFAULT_SLIPPAGE}`);
  const [slippageMode, setSlippageMode] = useState<"auto" | "custom">("auto");
  const [validity, setValidity] = useState(DEFAULT_VALIDITY);
  const [validityInput, setValidityInput] = useState(`${DEFAULT_VALIDITY}`);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Exchange rate state
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Allowance and transaction state
  const [showAllowanceDialog, setShowAllowanceDialog] = useState(false);
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [isApprovingAllowance, setIsApprovingAllowance] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // Swap success and errors
  const [showSwapSuccess, setShowSwapSuccess] = useState(false);
  const [txReceipt, setTxReceipt] = useState<TxData | null>(null);

  const getTokensSync = () => {
    getTokens()
      .then((t) => {
        setTokens(t);
        // if (!payToken.address) setPayToken(t[0]);
        // if (!receiveToken.address) setReceiveToken(t[1]);
        setLastUpdated(new Date());
        for (const token of t) {
          if (token.symbol === "USDC") {
            setUsdcNativePrice(token.nativePrice);
          }
        }
      })
      .catch((error) => console.error("Error fetching tokens:", error));
  };

  // Get tokens
  useEffect(() => {
    getTokensSync();
  }, []);

  // Set up exchange rate update interval
  useExchangeRate(() => getTokensSync(), EXCHANGE_RATE_UPDATE_INTERVAL);

  // Update receive amount when pay amount or exchange rate changes
  useEffect(() => {
    if (payAmount && tokens.length > 0) {
      const exchangeRate = payToken.nativePrice / receiveToken.nativePrice;
      const calculated = Number.parseFloat(payAmount) * exchangeRate;
      setReceiveAmount(calculated.toFixed(6));
    } else {
      setReceiveAmount("");
    }
  }, [payAmount, tokens, payToken, receiveToken]);

  // Handle token swap
  const handleSwapTokens = () => {
    const tempToken = payToken;
    setPayToken(receiveToken);
    setReceiveToken(tempToken);
    setPayAmount(receiveAmount);
  };

  const handleSetPayAmount = (amount: string) => {
    const value = Number.parseFloat(amount);
    if (value < 0) {
      setPayAmount("0");
    } else {
      setPayAmount(amount);
    }
  };

  // Handle slippage change
  const handleSlippageChange = (value: string) => {
    setSlippageInput(value);

    // Blank input shouldn't modify the numeric state
    if (value === "") return;

    const num = Number.parseFloat(value);
    if (!Number.isNaN(num) && num >= 0 && num <= 100) {
      setSlippage(num);
      setCustomSlippage(value);
    }
  };

  // Handle validity change
  const handleValidityChange = (value: string) => {
    setValidityInput(value);

    // Blank input shouldn't modify the numeric state
    if (value === "") return;

    const num = Number.parseInt(value);
    if (Number.isNaN(num) || num <= 0) {
      // 0 or invalid → reset to default
      setValidity(DEFAULT_VALIDITY);
      setValidityInput(`${DEFAULT_VALIDITY}`);
    } else {
      setValidity(num);
    }
  };

  // Get slippage warning
  const getSlippageWarning = () => {
    const currentSlippage =
      slippageMode === "auto" ? DEFAULT_SLIPPAGE : slippage;
    if (currentSlippage >= 20) {
      return { type: "error", message: "Slippage is very high" };
    } else if (currentSlippage > 5.5) {
      return { type: "warning", message: "Slippage is high" };
    }
    return null;
  };

  // Get validity warning
  const getValidityWarning = () => {
    if (validity >= 60) {
      return { type: "warning", message: "High max validity" };
    }
    return null;
  };

  // Handle swap button click
  const handleSwap = async () => {
    if (!isConnected) {
      //   handleWalletConnect(); TODO: Implement wallet connection logic
      return;
    }

    if (!payAmount || !receiveAmount || !address) {
      return;
    }

    try {
      setIsCheckingAllowance(true);

      // Check if allowance is sufficient
      const hasAllowance = await checkAllowance(
        payToken,
        payAmount,
        address,
        METHOD.SWAP
      );

      setIsCheckingAllowance(false);

      if (!hasAllowance) {
        // Show allowance dialog
        setShowAllowanceDialog(true);
      } else {
        setShowSwapConfirmation(true);
      }
    } catch (error) {
      console.error("Error checking allowance:", error);
      setIsCheckingAllowance(false);
      setErrorMessage(`Error checking allowance. Please try again.`);
      setShowErrorDialog(true);
    }
  };

  // Handle allowance approval
  const handleApproveAllowance = async () => {
    if (!signer) {
      console.error("Signer is not available");
      setErrorMessage("Wallet connection error. Please reconnect and try again.");
      setShowErrorDialog(true);
      return;
    }

    try {
      setIsApprovingAllowance(true);

      const success = await approveAllowance(
        payToken,
        payAmount,
        signer,
        METHOD.SWAP
      );

      if (success) {
        setShowSwapConfirmation(true);
      }
    } catch (error) {
      console.error("Error approving allowance:", error);
      setErrorMessage(`Error approving allowance. Please try again.`);
      setShowErrorDialog(true);
    } finally {
      setIsApprovingAllowance(false);
      setShowAllowanceDialog(false);
    }
  };

  // Perform the actual swap
  const performSwap = async () => {
    if (!signer) {
      console.error("Signer is not available");
      setErrorMessage("Wallet connection error. Please reconnect and try again.");
      setShowErrorDialog(true);
      return;
    }
    try {
      setIsSwapping(true);

      const success = await executeSwap(
        payToken,
        receiveToken,
        payAmount,
        slippage,
        validity,
        signer
      );

      if (success) {
        setPayAmount("");
        setReceiveAmount("");
        setTxReceipt(success);
        setShowSwapSuccess(true);
      }
    } catch (error) {
      console.error("Error executing swap:", error);
      if (error === NoReceiptError) {
        setErrorMessage(`Error executing swap - receipt not found. Please check the transaction in the Blockscout.`);
      } else {
        setErrorMessage(`Error executing swap. Please try again.`);
      }
      setShowErrorDialog(true);
    } finally {
      setIsSwapping(false);
      setShowSwapConfirmation(false);
    }
  };

  const handleSetPToken = (t: string) => {
    setPayToken(tokens.find((token) => token.symbol === t) || tokens[0]);
  };

  const handleSetRToken = (t: string) => {
    setReceiveToken(tokens.find((token) => token.symbol === t) || tokens[0]);
  };

  const getUSDCPayAmount = (amount: string, token: UserToken) => {
    if (token.symbol === "USDC") {
      return amount;
    }

    const rate = token.nativePrice / usdcNativePrice
    return (Number.parseFloat(amount) * rate).toString();
  }

  const slippageWarning = getSlippageWarning();
  const validityWarning = getValidityWarning();
  const currentSlippage = slippageMode === "auto" ? DEFAULT_SLIPPAGE : slippage;

  return (
    <div className="flex justify-center items-start pt-20 px-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">Swap</h1>
            <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Settings className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h3 className="font-medium">Transaction Settings</h3>

                  {/* Slippage Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Max slippage</Label>
                      <Info className="w-3 h-3 text-gray-400" />
                    </div>
                    <Tabs
                      value={slippageMode}
                      onValueChange={(v) =>
                        setSlippageMode(v as "auto" | "custom")
                      }
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="auto">Auto</TabsTrigger>
                        <TabsTrigger value="custom">Custom</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    {slippageMode === "custom" && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="5.5"
                          value={slippageInput}
                          onChange={(e) => handleSlippageChange(e.target.value)}
                          className="flex-1"
                          min="0"
                          max="100"
                          step="0.1"
                          lang={"en-EN"}
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    )}
                    {slippageWarning && (
                      <Alert
                        variant={
                          slippageWarning.type === "error"
                            ? "destructive"
                            : "default"
                        }
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {slippageWarning.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Validity Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">
                        Transaction validity period
                      </Label>
                      <Info className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={validityInput}
                        onChange={(e) => handleValidityChange(e.target.value)}
                        className="flex-1"
                        min="1"
                        lang={"en"}
                      />
                      <span className="text-sm text-gray-500">minutes</span>
                    </div>
                    {validityWarning && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {validityWarning.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Pay Section */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <Label className="text-sm text-gray-600 mb-2 block">
                You pay
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  lang={"en"}
                  placeholder="0"
                  min="0"
                  value={payAmount}
                  onChange={(e) => handleSetPayAmount(e.target.value)}
                  className="flex-1 border-0 bg-transparent font-semibold p-0 h-auto md:text-2xl"
                  step="any"
                  disabled={!payToken.address || !receiveToken.address}
                />
                <Select value={payToken.symbol} onValueChange={handleSetPToken}>
                  <SelectTrigger className="w-auto border-0 bg-white rounded-full px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{payToken.symbol}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <span>{token.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {payAmount && (
                <div className="text-sm text-gray-500 mt-2">
                  {getUSDCPayAmount(payAmount, payToken)} USDC
                </div>
              )}
            </div>

            {/*Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSwapTokens}
                className="rounded-full p-2 border bg-white hover:bg-gray-50"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Receive Section */}
            <div className="bg-gray-50 rounded-xl p-4">
              <Label className="text-sm text-gray-600 mb-2 block">
                You receive
              </Label>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-2xl font-semibold text-gray-900">
                  {receiveAmount || "0"}
                </div>
                <Select
                  value={receiveToken.symbol}
                  onValueChange={handleSetRToken}
                >
                  <SelectTrigger className="w-auto border-0 bg-white rounded-full px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{receiveToken.symbol}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <span>{token.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {receiveAmount && (
                <div className="text-sm text-gray-500 mt-2">
                  {getUSDCPayAmount(receiveAmount, receiveToken)} USDC
                </div>
              )}
            </div>

            {/* Exchange Rate Info */}
            {payToken.address && receiveToken.address && payToken.address !== receiveToken.address && (
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>
                    1 {receiveToken.symbol} ={" "}
                    {receiveToken.nativePrice / payToken.nativePrice}{" "}
                    {payToken.symbol}
                  </span>
                  {lastUpdated && <LastUpdated lastUpdated={lastUpdated} />}
                </div>
              </div>
            )}

            {/* Transaction Details */}
            {payAmount && receiveAmount && (
              <div className="space-y-2 text-sm text-gray-600">
                {/*<div className="flex justify-between">*/}
                {/*  <span>Price impact</span>*/}
                {/*  <span className="text-green-600">0.01%</span>*/}
                {/*</div>*/}
                <div className="flex justify-between">
                  <span>Max slippage</span>
                  <span>{currentSlippage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Network cost</span>
                  <span className="flex items-center gap-1">
                    {/*<span className="text-blue-600">ⓘ</span>*/}
                    0.10 USDC
                  </span>
                </div>
                {/*<div className="flex justify-between">*/}
                {/*  <span>Order routing</span>*/}
                {/*  <span>Uniswap Client</span>*/}
                {/*</div>*/}
              </div>
            )}

            {/* Swap Button */}
            {isConnected ? (
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl"
                disabled={
                  !payAmount ||
                  !receiveAmount ||
                  isCheckingAllowance ||
                  isSwapping
                }
                onClick={handleSwap}
              >
                {isCheckingAllowance
                  ? "Checking allowance..."
                  : isSwapping
                  ? "Swapping..."
                  : "Swap"}
              </Button>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl"
                onClick={openConnectModal}
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Swap Confirmation Dialog */}
      <Dialog open={showSwapConfirmation} onOpenChange={setShowSwapConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Swap</DialogTitle>
            <DialogDescription>Review your swap details before proceeding.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">You pay:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{payAmount}</span>
                  <span className="text-lg">{payToken.symbol}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">You receive:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{receiveAmount}</span>
                  <span className="text-lg">{receiveToken.symbol}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Max slippage:</span>
                <span className="font-medium">{slippageMode === "auto" ? DEFAULT_SLIPPAGE : slippage}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Network cost:</span>
                <span className="font-medium">~0.10 USDC</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-center">
              Output is estimated.
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSwapConfirmation(false)} disabled={isSwapping}>
              Cancel
            </Button>
            <Button
                onClick={performSwap}
                disabled={isSwapping}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isSwapping ? "Swapping..." : "Confirm Swap"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Swap success */}
      <Dialog open={showSwapSuccess} onOpenChange={setShowSwapSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Swap Successful
            </DialogTitle>
            <DialogDescription>Your swap has been completed successfully.</DialogDescription>
          </DialogHeader>
          {txReceipt && (
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800">Swapped:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{txReceipt.payed}</span>
                      <span className="text-lg">{payToken.symbol}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-800">Received:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{txReceipt.received}</span>
                      <span className="text-lg">{receiveToken.symbol}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">Fee chain:</span>
                    <span className="font-medium">{txReceipt.feeChain}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">Fee swap:</span>
                    <span className="font-medium">{txReceipt.feeSwap}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium mb-2">Transaction Hash:</div>
                  <div className="text-xs font-mono bg-white p-2 rounded border break-all">{txReceipt.txHash}</div>
                </div>

                <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => window.open(`${CHAIN_CONFIG.BLOCKSCOUT_URL}/tx/${txReceipt?.txHash}`, "_blank")}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View on Blockscout
                </Button>
              </div>
          )}
          <DialogFooter>
            <Button
                onClick={() => {
                  setShowSwapSuccess(false)
                  setTxReceipt(null)
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allowance Dialog */}
      <Dialog open={showAllowanceDialog} onOpenChange={setShowAllowanceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Allowance Required
            </DialogTitle>
            <DialogDescription className="text-left">
              You need to give permission for the Uniswap protocol to spend your{" "}
              {payToken.symbol} tokens. This is a one-time transaction that
              allows the protocol to access your tokens for trading.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Token to approve:</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{payToken.symbol}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">
                  {payAmount} {payToken.symbol}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              This transaction will require gas fees. After approval, your swap
              will be executed automatically.
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAllowanceDialog(false)}
              disabled={isApprovingAllowance}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveAllowance}
              disabled={isApprovingAllowance}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isApprovingAllowance ? "Approving..." : "Approve & Swap"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              Transaction Failed
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-sm text-red-800">{errorMessage}</div>
            </div>
          </div>
          <DialogFooter>
            <Button
                onClick={() => {
                  setShowErrorDialog(false)
                  setErrorMessage("")
                }}
                className="w-full"
                variant="outline"
            >
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
