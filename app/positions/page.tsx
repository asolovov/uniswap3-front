"use client"

import {useEffect, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Plus} from "lucide-react"
import {POSITION_STATUS, UserPosition, UserToken} from "@/models/models";
import NewPosition from "@/components/positions/new-position";
import {getUserPositions} from "@/uniswap/positions";
import {getTokens} from "@/uniswap/tokens";
import {useExchangeRate} from "@/components/updates";

const EXCHANGE_RATE_UPDATE_INTERVAL = 30000; // 30 seconds

export default function PositionsPage() {
    // Tokens state
    const [tokens, setTokens] = useState<{[key: string]: UserToken}>({});
    const [usdcNativePrice, setUsdcNativePrice] = useState(0);

    const [userPositions, setUserPositions] = useState<UserPosition[]>([])
    const [showNewPosition, setShowNewPosition] = useState(false)

    const getPositionsSync = () => {
        getUserPositions().then(p => {
            setUserPositions(p)
        }).catch(error => console.error("Error fetching user positions:", error))
    }

    // Set up exchange rate update interval
    useExchangeRate(() => getTokensSync(), EXCHANGE_RATE_UPDATE_INTERVAL);

    const getTokensSync = () => {
        getTokens()
            .then((t) => {
                const userTokens = {} as {[key: string]: UserToken};

                for (const token of t) {
                    userTokens[token.symbol] = token;

                    if (token.symbol === "USDC") {
                        setUsdcNativePrice(token.nativePrice);
                    }
                }

                setTokens(userTokens);
            })
            .catch((error) => console.error("Error fetching tokens:", error));
    };


    useEffect(() => {
        getPositionsSync()
        getTokensSync()
    }, []);


    const getStatusColor = (s: POSITION_STATUS) => {
        switch (s) {
            case POSITION_STATUS.POSITION_STATUS_CLOSED:
                return "bg-gray-500 text-white"
            case POSITION_STATUS.POSITION_STATUS_IN_RANGE:
                return "bg-green-500 text-white"
            case POSITION_STATUS.POSITION_STATUS_OUT_OF_RANGE:
                return "bg-yellow-500 text-white"
        }
    }

    const getStatusText = (s: POSITION_STATUS) => {
        switch (s) {
            case POSITION_STATUS.POSITION_STATUS_CLOSED:
                return "Closed"
            case POSITION_STATUS.POSITION_STATUS_IN_RANGE:
                return "In range"
            case POSITION_STATUS.POSITION_STATUS_OUT_OF_RANGE:
                return "Out of range"
        }
    }

    const calculatePositionValue = (position: UserPosition) => {
        if (tokens[position.token0.symbol] && tokens[position.token1.symbol]) {
            const t0Value = (tokens[position.token0.symbol].nativePrice / usdcNativePrice) * Number.parseFloat(position.amount0);
            const t1Value = (tokens[position.token1.symbol].nativePrice / usdcNativePrice) * Number.parseFloat(position.amount1);
            return t0Value + t1Value;
        }

        return 0
    }

    const calculateCurrentPrice = (position: UserPosition) => {
        if (tokens[position.token0.symbol] && tokens[position.token1.symbol]) {
            return tokens[position.token1.symbol].nativePrice / tokens[position.token0.symbol].nativePrice;
        }

        return 0
    }

    if (showNewPosition) {
        return <NewPosition setShowNewPosition={setShowNewPosition} tokens={tokens}/>
    }

    // Main positions page
    return (
            <div className="max-w-4xl mx-auto pt-8 px-4 mb-4">
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
                {userPositions.length === 0 ? (
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
                        {userPositions.map((position) => (
                            <Card key={position.tokenId} className="bg-white/90 backdrop-blur-sm shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="font-semibold text-lg">
                                                    {position.token0.symbol} - {position.token1.symbol}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">{position.feeTier}% fee tier</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(position.status)}`}>
                            {getStatusText(position.status)}
                          </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-lg">{calculatePositionValue(position).toLocaleString()} USDC</div>
                                            <div className="text-sm text-gray-500">Total Value</div>
                                        </div>
                                    </div>

                                    {/* Position Details */}
                                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                                        <div>
                                            <div className="text-gray-500">Low price 1 {position.token1.symbol}</div>
                                            <div className="font-medium">
                                                {position.rangeLower} {position.token0.symbol}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">High price 1 {position.token1.symbol}</div>
                                            <div className="font-medium">
                                                {position.rangeUpper} {position.token0.symbol}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Current Price 1 {position.token1.symbol}</div>
                                            <div className="font-medium">
                                                {calculateCurrentPrice(position)} {position.token0.symbol}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                                        <div>
                                            <div className="text-gray-500">Current Amount {position.token0.symbol}</div>
                                            <div className="font-medium">
                                                {position.amount0} {position.token0.symbol}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Current Amount {position.token1.symbol}</div>
                                            <div className="font-medium">
                                                {position.amount1} {position.token1.symbol}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                                        <div>
                                            <div className="text-gray-500">Uncollected Fee {position.token0.symbol}</div>
                                            <div className="font-medium">
                                                {position.token0UncollectedFees} {position.token0.symbol}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Uncollected Fee {position.token1.symbol}</div>
                                            <div className="font-medium">
                                                {position.token1UncollectedFees} {position.token1.symbol}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-4 border-t">
                                      <Button
                                        variant={"outline"}
                                        size={"sm"}
                                        className={"flex-1"}
                                        disabled={position.status === POSITION_STATUS.POSITION_STATUS_CLOSED}
                                      >Increase Liquidity</Button>

                                      <Button
                                          variant={"outline"}
                                          size={"sm"}
                                          className={"flex-1"}
                                          disabled={position.status === POSITION_STATUS.POSITION_STATUS_CLOSED}
                                      >Decrease Liquidity</Button>

                                      <Button
                                          variant={"outline"}
                                          size={"sm"}
                                          className={"flex-1"}
                                          disabled={Number.parseFloat(position.token0UncollectedFees) === 0 && Number.parseFloat(position.token1UncollectedFees) === 0}
                                      >Collect fees</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
    )
}
