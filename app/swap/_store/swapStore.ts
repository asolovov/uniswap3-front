import {create} from "zustand";
import {UserToken} from "@/models/models";
import {TxData} from "@/uniswap/swap";

export type State = {
    tokens: { [key: string]: UserToken }
    usdcNativePrice: number
    tokenLastUpdated: Date

    isSwapSettingsOpen: boolean
    validity: number
    validityWarning: string | null
    slippageMode: "auto" | "custom"
    slippage: number
    slippageWarning: {
        message: string,
        variant: "destructive" | "default"
    } | null

    payToken: UserToken | null
    payAmount: string
    receiveToken: UserToken | null
    receiveAmount: string

    estimateTxFeeUSDC: number

    isShowAllowanceModal: boolean
    isCheckingAllowance: boolean
    isApprovingAllowance: boolean
    isShowSwapModal: boolean
    isSwapping: boolean
    isShowSwapSuccess: boolean

    txReceipt: TxData | null

    errMessage: {
        message: string,
    } | null
}

type Actions = {
    getTokens: () => UserToken[]
    setTokens: (tokens: UserToken[]) => void

    setSwapSettingsOpen: (open: boolean) => void
    setValidity: (validity: number) => void
    setValidityWarning: (warning: string | null) => void
    setSlippageMode: (mode: "auto" | "custom") => void
    setSlippage: (input: number) => void
    setSlippageWarning: (warning: { message: string, variant: "destructive" | "default" } | null) => void

    setPayTokenBySymbol: (symbol: string) => void
    setPayToken: (payToken: UserToken | null) => void
    setReceiveTokenBySymbol: (symbol: string) => void
    setReceiveToken: (receiveToken: UserToken | null) => void
    setPayAmount: (amount: string) => void
    setReceiveAmount: (amount: string) => void

    setIsShowAllowanceModal: (isShow: boolean) => void
    setIsCheckingAllowance: (isChecking: boolean) => void
    setIsApprovingAllowance: (isApproving: boolean) => void
    setIsSwapping: (isSwapping: boolean) => void
    setIsShowSwapModal: (isShow: boolean) => void
    setIsShowSwapSuccess: (isShow: boolean) => void

    setTxReceipt: (txReceipt: TxData | null) => void

    setErrMessage: (message: { message: string } | null) => void
}

export const createSwapStore = (initTokens: {
    [key: string]: UserToken
}, usdcNatviePrice: number, lastUpdate: Date) => create<State & Actions>(
    (set, get) => ({
        tokens: initTokens,
        usdcNativePrice: usdcNatviePrice,
        tokenLastUpdated: lastUpdate,
        isSwapSettingsOpen: false,
        validity: 30,
        validityWarning: null,
        slippageMode: "auto",
        slippage: 5.5,
        slippageWarning: null,
        payToken: null,
        payAmount: "",
        receiveToken: null,
        receiveAmount: "",
        estimateTxFeeUSDC: 0.1, //TODO: unmock data, add logic
        isShowAllowanceModal: false,
        isCheckingAllowance: false,
        isApprovingAllowance: false,
        isShowSwapModal: false,
        isSwapping: false,
        isShowSwapSuccess: false,
        txReceipt: null,
        errMessage: null,
        getTokens: () => Object.values(get().tokens),
        setTokens: (tokens: UserToken[]) => {
            set({
                tokens: Object.fromEntries(tokens.map(t => {
                    if (t.symbol === "USDC") {
                        set({usdcNativePrice: t.nativePrice})
                        console.log("set usdc native price", t.nativePrice)
                    }
                    return [t.symbol, t]
                }))
            })
            set({tokenLastUpdated: new Date()})

            const payToken = get().payToken
            if (payToken) {
                set({payToken: get().tokens[payToken.symbol]})
            }

            const receiveToken = get().receiveToken
            if (receiveToken) {
                set({receiveToken: get().tokens[receiveToken.symbol]})
            }
        },
        setSwapSettingsOpen: (open: boolean) => set({isSwapSettingsOpen: open}),
        setValidity: (validity: number) => {
            const s = get()
            if (s.validityWarning && validity < 60) {
                set({validityWarning: null})
            } else if (validity >= 60) {
                set({validityWarning: "High max validity"})
            }

            set({validity})
        },
        setValidityWarning: (warning: string | null) => set({validityWarning: warning}),
        setSlippageMode: (mode: "auto" | "custom") => set({slippageMode: mode}),
        setSlippage: (slippage: number) => {
            const s = get()
            if (s.slippageWarning && slippage <= 5.5) {
                set({slippageWarning: null})
            } else if (slippage >= 20) {
                set({slippageWarning: {message: "Slippage is very high", variant: "destructive"}})
            } else if (slippage > 5.5) {
                set({slippageWarning: {message: "Slippage is high", variant: "default"}})
            }
            set({slippage})
        },
        setSlippageWarning: (warning: {
            message: string,
            variant: "destructive" | "default"
        } | null) => set({slippageWarning: warning}),
        setPayTokenBySymbol: (symbol: string) => set({payToken: get().tokens[symbol]}),
        setPayToken: (payToken: UserToken | null) => set({payToken}),
        setReceiveTokenBySymbol: (symbol: string) => set({receiveToken: get().tokens[symbol]}),
        setReceiveToken: (receiveToken: UserToken | null) => set({receiveToken}),
        setPayAmount: (amount: string) => {
            if (amount === "") {
                set({payAmount: ""})
                return
            }

            const n = Number.parseFloat(amount)
            if (n > 0) {
                set({payAmount: amount})
            } else {
                set({payAmount: "0"})
            }
        },
        setReceiveAmount: (amount: string) => {
            const n = Number.parseFloat(amount)
            if (n > 0) {
                set({receiveAmount: amount})
            } else {
                set({receiveAmount: "0"})
            }
        },
        setIsShowAllowanceModal: isShowAllowanceModal => set({isShowAllowanceModal}),
        setIsCheckingAllowance: isCheckingAllowance => set({isCheckingAllowance}),
        setIsApprovingAllowance: isApprovingAllowance => set({isApprovingAllowance}),
        setIsSwapping: isSwapping => set({isSwapping}),
        setIsShowSwapModal: isShowSwapModal => set({isShowSwapModal}),
        setIsShowSwapSuccess: isShowSwapSuccess => set({isShowSwapSuccess}),
        setTxReceipt: txReceipt => set({txReceipt}),
        setErrMessage: message => set({errMessage: message}),
    })
)
