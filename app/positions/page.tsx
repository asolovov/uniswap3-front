"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Plus, Minus, AlertTriangle, Info, ChevronLeft } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

// Global constants
const DEFAULT_SLIPPAGE = 5.5
const DEFAULT_VALIDITY = 30
const PRICE_UPDATE_INTERVAL = 30000 // 30 seconds

// Mock tokens with addresses for sorting
const TOKENS = [
    { symbol: "USDC", name: "USD Coin", icon: "💰", address: "0xA0b86a33E6441E6C7D3E4C2A4B5F6E7D8C9B0A1F" },
    { symbol: "ETH", name: "Ethereum", icon: "⟠", address: "0x0000000000000000000000000000000000000000" },
    { symbol: "BTC", name: "Bitcoin", icon: "₿", address: "0xB1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0" },
    { symbol: "TEST", name: "Test Token", icon: "🧪", address: "0xC2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1" },
]

// Fee tiers with tick spacing
const FEE_TIERS = [
    { fee: 0.01, tickSpacing: 1 },
    { fee: 0.05, tickSpacing: 10 },
    { fee: 0.3, tickSpacing: 60 },
    { fee: 1.0, tickSpacing: 200 },
]

// Mock current prices
const CURRENT_PRICES: Record<string, number> = {
    "ETH-USDC": 2500,
    "USDC-ETH": 0.0004,
    "BTC-USDC": 43500,
    "USDC-BTC": 0.000023,
    "ETH-BTC": 0.058,
    "BTC-ETH": 17.2,
}

// Mock positions data
const MOCK_POSITIONS = [
    {
        id: 1,
        token0: "ETH",
        token1: "USDC",
        fee: 0.3,
        lowPrice: 2000,
        highPrice: 3000,
        currentPrice: 2500,
        liquidity: 1.5,
        value: 7500,
    },
]

export default function PositionsPage() {
    // Navigation state
    const [showNewPosition, setShowNewPosition] = useState(false)

    // Wallet state
    const [isWalletConnected, setIsWalletConnected] = useState(true) // Assume connected from swap page
    const [walletAddress, setWalletAddress] = useState("0x8382...feCb")

    // Position form state
    const [baseToken, setBaseToken] = useState("")
    const [quoteToken, setQuoteToken] = useState("")
    const [selectedFeeTier, setSelectedFeeTier] = useState(0.3)
    const [lowPrice, setLowPrice] = useState("")
    const [highPrice, setHighPrice] = useState("")
    const [lowPriceInput, setLowPriceInput] = useState("")
    const [highPriceInput, setHighPriceInput] = useState("")
    const [baseAmount, setBaseAmount] = useState("")
    const [quoteAmount, setQuoteAmount] = useState("")
    const [currentPrice, setCurrentPrice] = useState<number | null>(null)

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

    // Get current tick spacing based on selected fee tier
    const getCurrentTickSpacing = () => {
        return FEE_TIERS.find((tier) => tier.fee === selectedFeeTier)?.tickSpacing || 60
    }

    // Convert price to tick value (simplified)
    const priceToTick = (price: number): number => {
        const tickSpacing = getCurrentTickSpacing()
        const tick = Math.log(price) / Math.log(1.0001)
        return Math.round(tick / tickSpacing) * tickSpacing
    }

    // Convert tick to price (simplified)
    const tickToPrice = (tick: number): number => {
        return Math.pow(1.0001, tick)
    }

    // Determine token order (token with higher address is token1)
    const getTokenOrder = (tokenA: string, tokenB: string) => {
        const addressA = TOKENS.find((t) => t.symbol === tokenA)?.address || ""
        const addressB = TOKENS.find((t) => t.symbol === tokenB)?.address || ""
        return addressA.toLowerCase() > addressB.toLowerCase()
            ? { token0: tokenB, token1: tokenA }
            : { token0: tokenA, token1: tokenB }
    }

    // Update current price
    const updateCurrentPrice = useCallback(() => {
        if (baseToken && quoteToken && baseToken !== quoteToken) {
            const priceKey = `${baseToken}-${quoteToken}`
            const price = CURRENT_PRICES[priceKey]
            if (price) {
                setCurrentPrice(price)
            }
        }
    }, [baseToken, quoteToken])

    // Update current price when tokens change
    useEffect(() => {
        updateCurrentPrice()
    }, [updateCurrentPrice])

    // Set up price update interval
    useEffect(() => {
        if (baseToken && quoteToken && baseToken !== quoteToken) {
            const interval = setInterval(updateCurrentPrice, PRICE_UPDATE_INTERVAL)
            return () => clearInterval(interval)
        }
    }, [baseToken, quoteToken, updateCurrentPrice])

    // Handle price input changes with tick conversion
    const handleLowPriceChange = (value: string) => {
        setLowPriceInput(value)
        if (value === "") {
            setLowPrice("")
            return
        }

        const numValue = Number.parseFloat(value)
        if (!Number.isNaN(numValue)) {
            const tick = priceToTick(numValue)
            const adjustedPrice = tickToPrice(tick)
            setLowPrice(adjustedPrice.toString())

            // Auto-adjust high price if needed
            if (highPrice && adjustedPrice >= Number.parseFloat(highPrice)) {
                const newHighTick = tick + getCurrentTickSpacing()
                const newHighPrice = tickToPrice(newHighTick)
                setHighPrice(newHighPrice.toString())
                setHighPriceInput(newHighPrice.toFixed(8))
            }
        }
    }

    const handleHighPriceChange = (value: string) => {
        setHighPriceInput(value)
        if (value === "") {
            setHighPrice("")
            return
        }

        const numValue = Number.parseFloat(value)
        if (!Number.isNaN(numValue)) {
            const tick = priceToTick(numValue)
            const adjustedPrice = tickToPrice(tick)
            setHighPrice(adjustedPrice.toString())

            // Auto-adjust low price if needed
            if (lowPrice && adjustedPrice <= Number.parseFloat(lowPrice)) {
                const newLowTick = tick - getCurrentTickSpacing()
                const newLowPrice = tickToPrice(newLowTick)
                setLowPrice(newLowPrice.toString())
                setLowPriceInput(newLowPrice.toFixed(8))
            }
        }
    }

    // Handle tick adjustments
    const adjustLowPrice = (direction: "up" | "down") => {
        if (!lowPrice) return
        const currentTick = priceToTick(Number.parseFloat(lowPrice))
        const tickSpacing = getCurrentTickSpacing()
        const newTick = direction === "up" ? currentTick + tickSpacing : currentTick - tickSpacing
        const newPrice = tickToPrice(newTick)
        setLowPrice(newPrice.toString())
        setLowPriceInput(newPrice.toFixed(8))
    }

    const adjustHighPrice = (direction: "up" | "down") => {
        if (!highPrice) return
        const currentTick = priceToTick(Number.parseFloat(highPrice))
        const tickSpacing = getCurrentTickSpacing()
        const newTick = direction === "up" ? currentTick + tickSpacing : currentTick - tickSpacing
        const newPrice = tickToPrice(newTick)
        setHighPrice(newPrice.toString())
        setHighPriceInput(newPrice.toFixed(8))
    }

    // Check which token can be deposited based on price range
    const getDepositableTokens = () => {
        if (!currentPrice || !lowPrice || !highPrice) return { canDepositBase: true, canDepositQuote: true }

        const low = Number.parseFloat(lowPrice)
        const high = Number.parseFloat(highPrice)

        if (currentPrice < low) {
            // Price is below range - can only deposit token1 (quote token in most cases)
            const { token0, token1 } = getTokenOrder(baseToken, quoteToken)
            return {
                canDepositBase: baseToken === token1,
                canDepositQuote: quoteToken === token1,
                isAboveRange: false,
                isBelowRange: true,
            }
        } else if (currentPrice > high) {
            // Price is above range - can only deposit token0 (base token in most cases)
            const { token0, token1 } = getTokenOrder(baseToken, quoteToken)
            return {
                canDepositBase: baseToken === token0,
                canDepositQuote: quoteToken === token0,
                isAboveRange: true,
                isBelowRange: false,
            }
        }

        return { canDepositBase: true, canDepositQuote: true, isAboveRange: false, isBelowRange: false }
    }

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
        if (!baseAmount && !quoteAmount) return

        try {
            setIsCheckingAllowance(true)

            // Check allowances for both tokens
            const tokensToCheck = []
            if (baseAmount) tokensToCheck.push({ token: baseToken, amount: baseAmount })
            if (quoteAmount) tokensToCheck.push({ token: quoteToken, amount: quoteAmount })

            for (const { token, amount } of tokensToCheck) {
                const hasAllowance = await checkAllowance(token, amount)
                if (!hasAllowance) {
                    setIsCheckingAllowance(false)
                    setPendingAllowanceToken(token)
                    setShowAllowanceDialog(true)
                    return
                }
            }

            setIsCheckingAllowance(false)
            await performAddPosition()
        } catch (error) {
            console.error("Error checking allowances:", error)
            setIsCheckingAllowance(false)
        }
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
        try {
            setIsAddingPosition(true)
            const success = await addLiquidityPosition()

            if (success) {
                // Reset form and go back to positions list
                setShowNewPosition(false)
                setBaseToken("")
                setQuoteToken("")
                setLowPrice("")
                setHighPrice("")
                setLowPriceInput("")
                setHighPriceInput("")
                setBaseAmount("")
                setQuoteAmount("")
                setShowPreview(false)
            }
        } catch (error) {
            console.error("Error adding position:", error)
        } finally {
            setIsAddingPosition(false)
        }
    }

    const depositableTokens = getDepositableTokens()
    const isFormValid = baseToken && quoteToken && lowPrice && highPrice && (baseAmount || quoteAmount)

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

    if (showNewPosition) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
                {/* Navbar */}
                <nav className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">U</span>
                            </div>
                            <span className="font-semibold text-lg">Uniswap</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" className="font-medium text-gray-500">
                                Swap
                            </Button>
                            <Button variant="ghost" className="font-medium">
                                Positions
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                            <span className="font-medium">{walletAddress}</span>
                        </div>
                    </div>
                </nav>

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
                                    <Button variant="ghost" size="sm" className="text-purple-600">
                                        Clear all
                                    </Button>
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
                                        <Select value={baseToken} onValueChange={setBaseToken}>
                                            <SelectTrigger className="flex-1">
                                                {baseToken ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{TOKENS.find((t) => t.symbol === baseToken)?.icon}</span>
                                                        <span className="font-medium">{baseToken}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">Select a token</span>
                                                )}
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TOKENS.map((token) => (
                                                    <SelectItem key={token.symbol} value={token.symbol}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{token.icon}</span>
                                                            <div>
                                                                <div className="font-medium">{token.symbol}</div>
                                                                <div className="text-sm text-gray-500">{token.name}</div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={quoteToken} onValueChange={setQuoteToken}>
                                            <SelectTrigger className="flex-1">
                                                {quoteToken ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{TOKENS.find((t) => t.symbol === quoteToken)?.icon}</span>
                                                        <span className="font-medium">{quoteToken}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Select a token
                          </span>
                                                )}
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TOKENS.filter((token) => token.symbol !== baseToken).map((token) => (
                                                    <SelectItem key={token.symbol} value={token.symbol}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{token.icon}</span>
                                                            <div>
                                                                <div className="font-medium">{token.symbol}</div>
                                                                <div className="text-sm text-gray-500">{token.name}</div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Fee Tier */}
                                {baseToken && quoteToken && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">{selectedFeeTier}% fee tier</span>
                                            <Button variant="ghost" size="sm" className="text-gray-500">
                                                Edit
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {FEE_TIERS.map((tier) => (
                                                <Button
                                                    key={tier.fee}
                                                    variant={selectedFeeTier === tier.fee ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setSelectedFeeTier(tier.fee)}
                                                    className="text-xs"
                                                >
                                                    {tier.fee}%
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Price Range */}
                                {baseToken && quoteToken && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base font-medium">Set price range</Label>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                                                    Full range
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-xs bg-transparent">
                                                    {baseToken}
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-xs text-gray-400 bg-transparent">
                                                    {quoteToken}
                                                </Button>
                                            </div>
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
                                                placeholder="0.0"
                                                value={lowPriceInput}
                                                onChange={(e) => handleLowPriceChange(e.target.value)}
                                                className="text-xl font-semibold border-0 bg-transparent p-0 h-auto mb-1"
                                                step="any"
                                            />
                                            <div className="text-sm text-gray-500">
                                                {quoteToken} per {baseToken}
                                            </div>
                                            {lowPrice && lowPriceInput !== lowPrice && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Adjusted to: {Number.parseFloat(lowPrice).toFixed(8)}
                                                </div>
                                            )}
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
                                                value={highPriceInput}
                                                onChange={(e) => handleHighPriceChange(e.target.value)}
                                                className="text-xl font-semibold border-0 bg-transparent p-0 h-auto mb-1"
                                                step="any"
                                            />
                                            <div className="text-sm text-gray-500">
                                                {quoteToken} per {baseToken}
                                            </div>
                                            {highPrice && highPriceInput !== highPrice && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Adjusted to: {Number.parseFloat(highPrice).toFixed(8)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Current Price */}
                                        {currentPrice && (
                                            <div className="space-y-1">
                                                <Label className="text-sm font-medium">Current price:</Label>
                                                <div className="text-2xl font-bold">{currentPrice}</div>
                                                <div className="text-sm text-gray-500">
                                                    {quoteToken} per {baseToken}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Deposit Amounts */}
                                {baseToken && quoteToken && lowPrice && highPrice && (
                                    <div className="space-y-4">
                                        <Label className="text-base font-medium">Deposit amounts</Label>

                                        {/* Range warnings */}
                                        {depositableTokens.isBelowRange && (
                                            <Alert>
                                                <Info className="h-4 w-4" />
                                                <AlertDescription className="text-sm">
                                                    Your position will be 100% composed of {baseToken} at current prices. The range is above the
                                                    current price.
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        {depositableTokens.isAboveRange && (
                                            <Alert>
                                                <Info className="h-4 w-4" />
                                                <AlertDescription className="text-sm">
                                                    Your position will be 100% composed of {quoteToken} at current prices. The range is below the
                                                    current price.
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        {/* Base Token Amount */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <Input
                                                type="number"
                                                placeholder={depositableTokens.canDepositBase ? "0" : "-"}
                                                value={baseAmount}
                                                onChange={(e) => setBaseAmount(e.target.value)}
                                                disabled={!depositableTokens.canDepositBase}
                                                className="text-xl font-semibold border-0 bg-transparent p-0 h-auto mb-2"
                                                step="any"
                                            />
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-500">{baseAmount && `${baseAmount} ${baseToken}`}</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{TOKENS.find((t) => t.symbol === baseToken)?.icon}</span>
                                                    <span className="font-medium">{baseToken}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quote Token Amount */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <Input
                                                type="number"
                                                placeholder={depositableTokens.canDepositQuote ? "0" : "-"}
                                                value={quoteAmount}
                                                onChange={(e) => setQuoteAmount(e.target.value)}
                                                disabled={!depositableTokens.canDepositQuote}
                                                className="text-xl font-semibold border-0 bg-transparent p-0 h-auto mb-2"
                                                step="any"
                                            />
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-500">{quoteAmount && `${quoteAmount} ${quoteToken}`}</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{TOKENS.find((t) => t.symbol === quoteToken)?.icon}</span>
                                                    <span className="font-medium">{quoteToken}</span>
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
                                {!baseToken || !quoteToken ? (
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
                    {baseToken}/{quoteToken}
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
                                {baseAmount && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{baseToken} deposit:</span>
                                        <span className="font-medium">{baseAmount}</span>
                                    </div>
                                )}
                                {quoteAmount && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{quoteToken} deposit:</span>
                                        <span className="font-medium">{quoteAmount}</span>
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
                                        <span className="text-lg">{TOKENS.find((t) => t.symbol === pendingAllowanceToken)?.icon}</span>
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
            </div>
        )
    }

    // Main positions page
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            {/* Navbar */}
            <nav className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">U</span>
                        </div>
                        <span className="font-semibold text-lg">Uniswap</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="font-medium text-gray-500">
                            Swap
                        </Button>
                        <Button variant="ghost" className="font-medium">
                            Positions
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isWalletConnected ? (
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                            <span className="font-medium">{walletAddress}</span>
                        </div>
                    ) : (
                        <Button>Connect</Button>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto pt-8 px-4">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Positions</h1>
                    <Button
                        onClick={() => setShowNewPosition(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Position
                    </Button>
                </div>

                {/* Positions List */}
                {MOCK_POSITIONS.length === 0 ? (
                    <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
                        <CardContent className="p-12 text-center">
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-gray-900">No positions yet</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        Your active liquidity positions will appear here. Create your first position to start earning fees.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setShowNewPosition(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Position
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {MOCK_POSITIONS.map((position) => (
                            <Card key={position.id} className="bg-white/90 backdrop-blur-sm shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">⟠</span>
                                                <span className="text-lg">💰</span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-lg">
                                                    {position.token0}/{position.token1}
                                                </div>
                                                <div className="text-sm text-gray-500">{position.fee}% fee tier</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-lg">${position.value.toLocaleString()}</div>
                                            <div className="text-sm text-gray-500">
                                                {position.liquidity} {position.token0}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t">
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <div className="text-gray-500">Low price</div>
                                                <div className="font-medium">{position.lowPrice}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">High price</div>
                                                <div className="font-medium">{position.highPrice}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">Current price</div>
                                                <div className="font-medium">{position.currentPrice}</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
