'use client'

import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {AlertTriangle, ChevronLeft, Info, Minus, Plus, Settings} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Label} from "@/components/ui/label";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Input} from "@/components/ui/input";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {FEE_TIER, FEE_TIER_SPACINGS, FEE_TIERS, UserToken} from "@/models/models";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {useEffect, useState} from "react";
import {Pool, Position} from "@uniswap/v3-sdk";
import {
    getNearestTickAndPrice,
    getNextTickAndPrice,
    getPool,
    getPrevTickAndPrice,
} from "@/uniswap/positions";

const DEFAULT_SLIPPAGE = 5.5
const DEFAULT_VALIDITY = 30

export default function NewPosition({setShowNewPosition, tokens}: {setShowNewPosition: (show: boolean) => void, tokens: {[key:string]: UserToken}}) {
    // Pool data
    const [tokenA, setTokenA] = useState({} as UserToken)
    const [tokenB, setTokenB] = useState({} as UserToken)
    const [selectedFeeTier, setSelectedFeeTier] = useState(FEE_TIER.F3000)
    const [pool, setPool] = useState<Pool>({} as Pool)
    const [currentPrice, setCurrentPrice] = useState<number | null>(null)

    // Position data
    const [amountA, setAmountA] = useState("")
    const [amountB, setAmountB] = useState("")
    const [lowPrice, setLowPrice] = useState("")
    const [highPrice, setHighPrice] = useState("")
    const [tickLower, setTickLower] = useState(0)
    const [tickUpper, setTickUpper] = useState(0)
    const [position, setPosition] = useState({} as Position)

    // Settings state (same as swap)
    const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE)
    const [slippageInput, setSlippageInput] = useState(`${DEFAULT_SLIPPAGE}`)
    const [slippageMode, setSlippageMode] = useState<"auto" | "custom">("auto")
    const [validity, setValidity] = useState(DEFAULT_VALIDITY)
    const [validityInput, setValidityInput] = useState(`${DEFAULT_VALIDITY}`)
    const [settingsOpen, setSettingsOpen] = useState(false)

    // Transaction state
    const [showPreview, setShowPreview] = useState(false)
    const [showAllowanceDialog, setShowAllowanceDialog] = useState(false)
    const [pendingAllowanceToken, setPendingAllowanceToken] = useState("")
    const [isCheckingAllowance, setIsCheckingAllowance] = useState(false)
    const [isApprovingAllowance, setIsApprovingAllowance] = useState(false)
    const [isAddingPosition, setIsAddingPosition] = useState(false)

    /////////////// TOKEN HELPERS //////////////////

    const handleSetTokenA = (t: string) => {
        setTokenA(tokens[t] || {} as UserToken)
    }

    const handleSetTokenB = (t: string) => {
        setTokenB(tokens[t] || {} as UserToken)
    }

    /////////////// UPDATES //////////////////

    // Pool change
    useEffect(() => {
        if (tokenA.address && tokenB.address) {
            getPool(tokenA, tokenB, selectedFeeTier).then(p => setPool(p)).catch(error => console.error("Error fetching pool:", error))
            console.log("pool set")
        }
    }, [tokenA, tokenB, selectedFeeTier]);

    useEffect(() => {
        if (tokens && pool && pool.token0.symbol && pool.token1.symbol) {
            setCurrentPrice(tokens[pool.token1.symbol].nativePrice / tokens[pool.token0.symbol].nativePrice)
        }

        // if (tokenA.address && tokenB.address && tokens[tokenA.symbol] && tokens[tokenB.symbol] && pool.token0.symbol && pool.token1.symbol) {
        //     setCurrentPrice(tokens[pool.token1.symbol].nativePrice / tokens[pool.token0.symbol].nativePrice)
        // }
    }, [pool, tokens]);

    /////////////// PRICES //////////////////

    const calculateCurrentPrice = () => {
        //1 token1 = x token0
    }

    const checkLowPriceChange = (tick: number) => {
        if (Number.parseFloat(lowPrice) > Number.parseFloat(highPrice)) {
            const hTickAndPrice = getNextTickAndPrice(tick, FEE_TIER_SPACINGS[selectedFeeTier])
            setTickUpper(hTickAndPrice.tick)
            setHighPrice(hTickAndPrice.price)
        }
    }

    const checkHighPriceChange = (tick: number) => {
        if (Number.parseFloat(highPrice) < Number.parseFloat(lowPrice)) {
            const lTickAndPrice = getPrevTickAndPrice(tick, FEE_TIER_SPACINGS[selectedFeeTier])
            setTickLower(lTickAndPrice.tick)
            setLowPrice(lTickAndPrice.price)
        }
    }

    // Handle price input changes with tick conversion
    const handleLowPriceChange = async () => {
        if (lowPrice === "") return

        const tickAndPrice = await getNearestTickAndPrice(lowPrice, FEE_TIER_SPACINGS[selectedFeeTier])
        setTickLower(tickAndPrice.tick)
        setLowPrice(tickAndPrice.price)

        checkLowPriceChange(tickAndPrice.tick)
    }

    const handleHighPriceChange = async () => {
        if (highPrice === "") return

        const tickAndPrice = await getNearestTickAndPrice(highPrice, FEE_TIER_SPACINGS[selectedFeeTier])
        setTickUpper(tickAndPrice.tick)
        setHighPrice(tickAndPrice.price)

        checkHighPriceChange(tickAndPrice.tick)
    }

    // Handle tick adjustments
    const adjustLowPrice = (direction: "up" | "down") => {
        if (tickLower === 0) return

        let tickAndPrice: { tick: number, price: string }
        if (direction === "up") {
            tickAndPrice = getNextTickAndPrice(tickLower, FEE_TIER_SPACINGS[selectedFeeTier])
            setTickLower(tickAndPrice.tick)
            setLowPrice(tickAndPrice.price)
        } else {
            tickAndPrice = getPrevTickAndPrice(tickLower, FEE_TIER_SPACINGS[selectedFeeTier])
            setTickLower(tickAndPrice.tick)
            setLowPrice(tickAndPrice.price)
        }

        checkLowPriceChange(tickAndPrice.tick)
    }

    const adjustHighPrice = (direction: "up" | "down") => {
        if (tickUpper === 0) return

        let tickAndPrice: { tick: number, price: string }
        if (direction === "up") {
            tickAndPrice = getNextTickAndPrice(tickUpper, FEE_TIER_SPACINGS[selectedFeeTier])
            setTickUpper(tickAndPrice.tick)
            setHighPrice(tickAndPrice.price)
        } else {
            tickAndPrice = getPrevTickAndPrice(tickUpper, FEE_TIER_SPACINGS[selectedFeeTier])
            setTickUpper(tickAndPrice.tick)
            setHighPrice(tickAndPrice.price)
        }

        checkHighPriceChange(tickAndPrice.tick)
    }

    /////////////// CONFIGS //////////////////

    // Handle settings changes (same as swap)
    const handleSlippageChange = (value: string) => {
        setSlippageInput(value)
        if (value === "") return
        const num = Number.parseFloat(value)
        if (!Number.isNaN(num) && num >= 0 && num <= 100) {
            setSlippage(num)
        }
    }

    const handleValidityChange = (value: string) => {
        setValidityInput(value)
        if (value === "") return
        const num = Number.parseInt(value)
        if (Number.isNaN(num) || num <= 0) {
            setValidity(DEFAULT_VALIDITY)
            setValidityInput(`${DEFAULT_VALIDITY}`)
        } else {
            setValidity(num)
        }
    }

    // Mock allowance and transaction functions
    const checkAllowance = async (token: string, amount: string): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return Math.random() > 0.5
    }

    const approveAllowance = async (token: string): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return true
    }

    const addLiquidityPosition = async (): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return true
    }

    // Handle preview and add position
    const handlePreview = () => {
        setShowPreview(true)
    }

    const handleAddPosition = async () => {
        // if (!amountA && !amountB) return
        //
        // try {
        //     setIsCheckingAllowance(true)
        //
        //     // Check allowances for both tokens
        //     const tokensToCheck = []
        //     if (amountA) tokensToCheck.push({ token: tokenA, amount: amountA })
        //     if (amountB) tokensToCheck.push({ token: tokenB, amount: amountB })
        //
        //     for (const { token, amount } of tokensToCheck) {
        //         const hasAllowance = await checkAllowance(token, amount)
        //         if (!hasAllowance) {
        //             setIsCheckingAllowance(false)
        //             setPendingAllowanceToken(token)
        //             setShowAllowanceDialog(true)
        //             return
        //         }
        //     }
        //
        //     setIsCheckingAllowance(false)
        //     await performAddPosition()
        // } catch (error) {
        //     console.error("Error checking allowances:", error)
        //     setIsCheckingAllowance(false)
        // }
    }

    const handleApproveAllowance = async () => {
        try {
            setIsApprovingAllowance(true)
            const success = await approveAllowance(pendingAllowanceToken)

            if (success) {
                setShowAllowanceDialog(false)
                setPendingAllowanceToken("")
                // Continue with checking remaining allowances
                await handleAddPosition()
            }
        } catch (error) {
            console.error("Error approving allowance:", error)
        } finally {
            setIsApprovingAllowance(false)
        }
    }

    const performAddPosition = async () => {
        // try {
        //     setIsAddingPosition(true)
        //     const success = await addLiquidityPosition()
        //
        //     if (success) {
        //         // Reset form and go back to positions list
        //         setShowNewPosition(false)
        //         setTokenA("")
        //         setTokenB("")
        //         setLowPrice("")
        //         setHighPrice("")
        //         setLowPriceInput("")
        //         setHighPriceInput("")
        //         setAmountA("")
        //         setAmountB("")
        //         setShowPreview(false)
        //     }
        // } catch (error) {
        //     console.error("Error adding position:", error)
        // } finally {
        //     setIsAddingPosition(false)
        // }
    }

    // const depositableTokens = getDepositableTokens()
    const isFormValid = tokenA && tokenB && lowPrice && highPrice && (amountA || amountB)

    // Get warnings
    const getSlippageWarning = () => {
        const currentSlippage = slippageMode === "auto" ? DEFAULT_SLIPPAGE : slippage
        if (currentSlippage >= 20) {
            return { type: "error", message: "Slippage is very high" }
        } else if (currentSlippage > 5.5) {
            return { type: "warning", message: "Slippage is high" }
        }
        return null
    }

    const getValidityWarning = () => {
        if (validity >= 60) {
            return { type: "warning", message: "High max validity" }
        }
        return null
    }

    const slippageWarning = getSlippageWarning()
    const validityWarning = getValidityWarning()

    return (
        <>
            {/* Main Content */}
            <div className="flex justify-center items-start pt-8 px-4">
                <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="sm" onClick={() => setShowNewPosition(false)} className="p-2">
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <h1 className="text-xl font-semibold">Add liquidity</h1>
                            </div>
                            <div className="flex items-center gap-2">
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
                                                <Tabs value={slippageMode} onValueChange={(v) => setSlippageMode(v as "auto" | "custom")}>
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
                                                        />
                                                        <span className="text-sm text-gray-500">%</span>
                                                    </div>
                                                )}
                                                {slippageWarning && (
                                                    <Alert variant={slippageWarning.type === "error" ? "destructive" : "default"}>
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <AlertDescription className="text-sm">{slippageWarning.message}</AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>

                                            {/* Validity Settings */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-sm">Transaction deadline</Label>
                                                    <Info className="w-3 h-3 text-gray-400" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        value={validityInput}
                                                        onChange={(e) => handleValidityChange(e.target.value)}
                                                        className="flex-1"
                                                        min="1"
                                                    />
                                                    <span className="text-sm text-gray-500">minutes</span>
                                                </div>
                                                {validityWarning && (
                                                    <Alert>
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <AlertDescription className="text-sm">{validityWarning.message}</AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Select Pair */}
                            <div className="space-y-3">
                                <Label className="text-base font-medium">Select pair</Label>
                                <div className="flex gap-3">
                                    <Select value={tokenA.symbol} onValueChange={handleSetTokenA}>
                                        <SelectTrigger className="flex-1">
                                            {tokenA.address ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{tokenA.symbol}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">Select a token</span>
                                            )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(tokens).map(([key, token]) => {
                                                if (tokenB.address && tokenB.address === token.address) {
                                                    return
                                                }
                                                return <SelectItem key={token.symbol} value={token.symbol}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{token.symbol}</span>
                                                    </div>
                                                </SelectItem>
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <Select value={tokenB.symbol} onValueChange={handleSetTokenB}>
                                        <SelectTrigger className="flex-1">
                                            {tokenB.address ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{tokenB.symbol}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">Select a token</span>
                                            )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(tokens).map(([key, token]) => {
                                                if (tokenA.address && tokenA.address === token.address) {
                                                    return
                                                }
                                                return <SelectItem key={token.symbol} value={token.symbol}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{token.symbol}</span>
                                                    </div>
                                                </SelectItem>
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Fee Tier */}
                            <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{selectedFeeTier}% fee tier</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {FEE_TIERS.map((tier) => (
                                            <Button
                                                key={tier}
                                                variant={selectedFeeTier === tier ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSelectedFeeTier(tier)}
                                                className="text-xs"
                                            >
                                                {tier}%
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                            {/* Price Range */}
                            {tokenA.address && tokenB.address && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-medium">Set price range</Label>
                                    </div>

                                    {/* Low Price */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label className="text-sm text-gray-600">Low price</Label>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => adjustLowPrice("up")}
                                                    className="p-1 h-6 w-6"
                                                    disabled={!lowPrice}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => adjustLowPrice("down")}
                                                    className="p-1 h-6 w-6"
                                                    disabled={!lowPrice}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <Input
                                            type="number"
                                            lang={"en"}
                                            placeholder="0.0"
                                            value={lowPrice}
                                            onChange={(e) => setLowPrice(e.target.value)}
                                            onBlur={(e) => handleLowPriceChange()}
                                            className="text-xl font-semibold border-0 bg-transparent p-0 h-auto mb-1"
                                            step="any"
                                        />
                                        <div className="text-sm text-gray-500">
                                            {tokenB.symbol} per {tokenA.symbol}
                                        </div>
                                        {/*{lowPrice && lowPriceInput !== lowPrice && (*/}
                                        {/*    <div className="text-xs text-gray-400 mt-1">*/}
                                        {/*        Adjusted to: {Number.parseFloat(lowPrice).toFixed(8)}*/}
                                        {/*    </div>*/}
                                        {/*)}*/}
                                    </div>

                                    {/* High Price */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label className="text-sm text-gray-600">High price</Label>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => adjustHighPrice("up")}
                                                    className="p-1 h-6 w-6"
                                                    disabled={!highPrice}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => adjustHighPrice("down")}
                                                    className="p-1 h-6 w-6"
                                                    disabled={!highPrice}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <Input
                                            type="number"
                                            placeholder="0.0"
                                            value={highPrice}
                                            onChange={(e) => setHighPrice(e.target.value)}
                                            onBlur={e => handleHighPriceChange()}
                                            className="text-xl font-semibold border-0 bg-transparent p-0 h-auto mb-1"
                                            step="any"
                                        />
                                        <div className="text-sm text-gray-500">
                                            {tokenB.symbol} per {tokenA.symbol}
                                        </div>
                                        {/*{highPrice && highPriceInput !== highPrice && (*/}
                                        {/*    <div className="text-xs text-gray-400 mt-1">*/}
                                        {/*        Adjusted to: {Number.parseFloat(highPrice).toFixed(8)}*/}
                                        {/*    </div>*/}
                                        {/*)}*/}
                                    </div>

                                    {/* Current Price */}
                                    {currentPrice && (
                                        <div className="space-y-1">
                                            <Label className="text-sm font-medium">Current price:</Label>
                                            <div className="text-2xl font-bold">{currentPrice}</div>
                                            <div className="text-sm text-gray-500">
                                                {tokenB.symbol} per {tokenA.symbol}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Deposit Amounts */}
                            {tokenA && tokenB && lowPrice && highPrice && (
                                <div className="space-y-4">
                                    <Label className="text-base font-medium">Deposit amounts</Label>

                                    {/* Range warnings */}
                                    {/*{depositableTokens.isBelowRange && (*/}
                                    {/*    <Alert>*/}
                                    {/*        <Info className="h-4 w-4" />*/}
                                    {/*        <AlertDescription className="text-sm">*/}
                                    {/*            Your position will be 100% composed of {tokenA} at current prices. The range is above the*/}
                                    {/*            current price.*/}
                                    {/*        </AlertDescription>*/}
                                    {/*    </Alert>*/}
                                    {/*)}*/}

                                    {/*{depositableTokens.isAboveRange && (*/}
                                    {/*    <Alert>*/}
                                    {/*        <Info className="h-4 w-4" />*/}
                                    {/*        <AlertDescription className="text-sm">*/}
                                    {/*            Your position will be 100% composed of {tokenB} at current prices. The range is below the*/}
                                    {/*            current price.*/}
                                    {/*        </AlertDescription>*/}
                                    {/*    </Alert>*/}
                                    {/*)}*/}

                                    {/* Base Token Amount */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <Input
                                            type="number"
                                            placeholder={"0"}
                                            value={amountA}
                                            onChange={(e) => setAmountA(e.target.value)}
                                            // disabled={"0"}
                                            className="text-xl font-semibold border-0 bg-transparent p-0 h-auto mb-2"
                                            step="any"
                                        />
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500">{amountA && `${amountA} ${tokenA.symbol}`}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{tokenA.symbol}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quote Token Amount */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <Input
                                            type="number"
                                            placeholder={"0"}
                                            value={amountB}
                                            onChange={(e) => setAmountB(e.target.value)}
                                            // disabled={!depositableTokens.canDepositQuote}
                                            className="text-xl font-semibold border-0 bg-transparent p-0 h-auto mb-2"
                                            step="any"
                                        />
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-500">{amountB && `${amountB} ${tokenB}`}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{tokenA.symbol}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preview Button */}
                            <Button
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl"
                                disabled={!isFormValid}
                                onClick={handlePreview}
                            >
                                Preview
                            </Button>

                            {/* Form validation message */}
                            {!tokenA || !tokenB ? (
                                <div className="text-sm text-gray-500 text-center p-4 bg-blue-50 rounded-lg">
                                    This pool must be initialized before you can add liquidity. To initialize, select a starting price
                                    for the pool. Then, enter your liquidity price range and deposit amount. Gas fees will be higher
                                    than usual due to the initialization transaction.
                                </div>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Preview Dialog */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Liquidity Preview</DialogTitle>
                        <DialogDescription>Review your liquidity position details before adding.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Pool:</span>
                                <span className="font-medium">
                    {tokenA.symbol}/{tokenB.symbol}
                  </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Fee tier:</span>
                                <span className="font-medium">{selectedFeeTier}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Price range:</span>
                                <span className="font-medium">
                    {Number.parseFloat(lowPrice).toFixed(4)} - {Number.parseFloat(highPrice).toFixed(4)}
                  </span>
                            </div>
                            {amountA && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{tokenA.symbol} deposit:</span>
                                    <span className="font-medium">{amountA}</span>
                                </div>
                            )}
                            {amountB && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{tokenB.symbol} deposit:</span>
                                    <span className="font-medium">{amountB}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowPreview(false)}>
                            Back
                        </Button>
                        <Button
                            onClick={handleAddPosition}
                            disabled={isCheckingAllowance || isAddingPosition}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                            {isCheckingAllowance ? "Checking allowances..." : isAddingPosition ? "Adding position..." : "Add"}
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
                            You need to give permission for the Uniswap protocol to spend your {pendingAllowanceToken} tokens.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Token to approve:</span>
                                <div className="flex items-center gap-2">
                                    {/*<span className="text-lg">{tokens.find((t) => t.symbol === pendingAllowanceToken)?.symbol}</span>*/}
                                    <span className="font-medium">{pendingAllowanceToken}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowAllowanceDialog(false)} disabled={isApprovingAllowance}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApproveAllowance}
                            disabled={isApprovingAllowance}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                            {isApprovingAllowance ? "Approving..." : "Approve"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}