"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Wallet, ArrowRight, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { BackgroundBeams } from "@/components/ui/background-beams"


interface PaymentState {
  publicKey: string | null
  recipient: string
  status: "idle" | "connecting" | "connected" | "signing" | "sending" | "success" | "error"
  errorMessage: string | null
}

interface PaymentModalProps {
  amount: string
  onComplete?: (success: boolean) => void
  onClose?: () => void
}

declare global {
  interface Window {
    freighterApi: any
  }
}

const initialState = (amount: string): PaymentState => ({
  publicKey: null,
  recipient: process.env.NEXT_PUBLIC_FREIGHTER_WALLET_RECIPIENT!,
  status: "idle",
  errorMessage: null,
})

export default function PaymentModal({ amount, onComplete, onClose }: PaymentModalProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>(initialState(amount))
  const [freighterLoaded, setFreighterLoaded] = useState(false)

  // Check if Freighter is loaded
  useEffect(() => {
    const checkForFreighter = () => {
      console.log("Checking for Freighter API...")
      console.log("window.freighterApi available:", typeof window !== "undefined" && !!window.freighterApi)

      if (typeof window !== "undefined" && window.freighterApi) {
        setFreighterLoaded(true)
        return true
      }
      return false
    }

    // Try immediately
    if (checkForFreighter()) return

    const timer = setTimeout(() => {
      if (checkForFreighter()) {
        console.log("Freighter API found after delay!")
      } else {
        console.log("Freighter API still not found after delay.")
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Only try to connect if Freighter is loaded
    if (freighterLoaded) {
      console.log("Freighter is loaded, attempting to connect...")

      const checkFreighter = async () => {
        try {
          console.log("Checking if Freighter is connected...")
          const isConnected = await window.freighterApi.isConnected()
          console.log("Freighter connected:", isConnected)

          if (!isConnected) {
            throw new Error("Freighter not connected")
          }

          try {
            await window.freighterApi.requestAccess()
          } catch (err) {
            console.error("Error checking if allowed:", err)
          }

          console.log("Getting public key...")
          const address = await window.freighterApi.getAddress()

          setPaymentState((prev) => ({ ...prev, publicKey: address, status: "connected" }))
        } catch (error: any) {
          console.error("Freighter not installed or not connected:", error)
          setPaymentState((prev) => ({
            ...prev,
            status: "error",
            errorMessage: "Freighter not installed or not connected.",
          }))
        }
      }

      checkFreighter()
    }
  }, [freighterLoaded])

  // Notify parent when transaction completes (success or failure)
  useEffect(() => {
    if (paymentState.status === "success" && onComplete) {
      onComplete(true)
    } else if (paymentState.status === "error" && onComplete) {
      onComplete(false)
    }
  }, [paymentState.status, onComplete])

  const handleConnectWallet = async () => {
    setPaymentState((prev) => ({ ...prev, status: "connecting", errorMessage: null }))
    try {
      if (typeof window !== "undefined" && window.freighterApi) {
        // First check if connected
        const isConnected = await window.freighterApi.isConnected()
        if (!isConnected) {
          throw new Error("Freighter not connected")
        }

        // Then check if allowed to connect to this website
        const isAllowed = await window.freighterApi.isAllowed()
        if (!isAllowed) {
          // This will trigger the permission prompt
          await window.freighterApi.setAllowed()
        }
      } else {
        throw new Error("Freighter extension not detected")
      }
    } catch (error: any) {
      console.error("Error connecting to Freighter:", error)
      setPaymentState((prev) => ({
        ...prev,
        status: "error",
        errorMessage: "Failed to connect to Freighter. Please check extension permissions.",
      }))
    }
  }

  const handlePay = async () => {
    if (!paymentState.publicKey) {
      setPaymentState((prev) => ({ ...prev, errorMessage: "Connect your wallet first." }))
      return
    }

    setPaymentState((prev) => ({ ...prev, status: "signing", errorMessage: null }))

    try {
      // Get current account and network
      const freighterPublicKey = await window.freighterApi.getAddress()
      console.log("Freighter details:", freighterPublicKey)

      // Get transaction XDR from backend
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderPublicKey: paymentState.publicKey.address,
          recipientPublicKey: paymentState.recipient,
          amount: amount,
        }),
      })

      if (!response.ok) throw new Error("Failed to create transaction")
      const { transactionXDR } = await response.json()

      const signedXDR = await window.freighterApi.signTransaction(transactionXDR, {
        network: "TESTNET", // Must be string literal
        accountToSign: freighterPublicKey.address, // Explicit signer
        networkPassphrase: "Test SDF Network ; September 2015",
        overwrite: true,
      })

      if (!signedXDR) throw new Error("Signing rejected or failed")

      // Submit to network
      const submitResponse = await fetch("/api/submit-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedXDR: signedXDR.signedTxXdr,
        }),
      })

      if (!submitResponse.ok) throw new Error("Submission failed")

      setPaymentState((prev) => ({ ...prev, status: "success" }))
    } catch (error: any) {
      console.error("Payment error:", error)
      setPaymentState((prev) => ({
        ...prev,
        status: "error",
        errorMessage: error.message || "Payment failed",
      }))
    }
  }

  // Helper function to truncate wallet address for display
  const truncateAddress = (address: string) => {
    if (!address) return ""
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`
  }

  // Get status badge based on current state
  const getStatusBadge = () => {
    switch (paymentState.status) {
      case "connecting":
        return (
          <div className="flex items-center gap-1 text-yellow-400">
            <Wallet className="h-4 w-4 animate-pulse" /> Connecting...
          </div>
        )
      case "connected":
        return (
          <div className="flex items-center gap-1 text-green-400">
            <CheckCircle2 className="h-4 w-4" /> Connected
          </div>
        )
      case "signing":
        return (
          <div className="flex items-center gap-1 text-yellow-400">
            <Wallet className="h-4 w-4 animate-pulse" /> Signing...
          </div>
        )
      case "sending":
        return (
          <div className="flex items-center gap-1 text-yellow-400">
            <ArrowRight className="h-4 w-4 animate-pulse" /> Sending...
          </div>
        )
      case "success":
        return (
          <div className="flex items-center gap-1 text-green-400">
            <CheckCircle2 className="h-4 w-4" /> Success
          </div>
        )
      case "error":
        return (
          <div className="flex items-center gap-1 text-red-400">
            <AlertCircle className="h-4 w-4" /> Error
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundBeams className="opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-neutral-800 bg-black/90 backdrop-blur-sm w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>

          {/* Close button */}
          {onClose && (
            <motion.button
              onClick={onClose}
              className="absolute top-3 right-3 text-neutral-400 hover:text-white z-10 p-1 rounded-full hover:bg-neutral-800/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </motion.button>
          )}

          <CardHeader>
            <div className="absolute top-2 right-10">{getStatusBadge()}</div>
            <CardTitle className="text-xl text-blue-400">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-blue-400" />
                Stellar Payment
              </div>
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Connect your wallet to pay {Number.parseFloat(amount).toFixed(2)} XLM
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {paymentState.publicKey ? (
                <motion.div
                  className="space-y-6"
                  key="wallet-connected"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Wallet Details Card */}
                  <div className="bg-neutral-900 p-4 rounded-lg border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <h3 className="text-md font-medium text-blue-400 mb-3">Wallet Details</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-neutral-400">Status</div>
                        <div className="text-sm font-medium text-blue-400">
                          {paymentState.status === "connected" ? "Connected" : paymentState.status}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-neutral-400">Address</div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          <span className="font-mono">
                            {typeof paymentState.publicKey === "string"
                              ? truncateAddress(paymentState.publicKey)
                              : truncateAddress(paymentState.publicKey?.address || "")}
                          </span>
                          <motion.button
                            onClick={() => {
                              const address =
                                typeof paymentState.publicKey === "string"
                                  ? paymentState.publicKey
                                  : paymentState.publicKey?.address
                              navigator.clipboard.writeText(address || "")
                            }}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                              <path d="M4 16V4a2 2 0 0 1 2-2h10" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-neutral-400">Network</div>
                        <div className="text-sm font-medium text-blue-400">Stellar Testnet</div>
                      </div>

                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-500/20">
                        <div className="text-sm text-neutral-400">Amount to Pay</div>
                        <div className="text-md font-medium text-blue-400">
                          {Number.parseFloat(amount).toFixed(2)} XLM
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handlePay}
                      disabled={paymentState.status === "signing" || paymentState.status === "sending"}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      {paymentState.status === "signing" || paymentState.status === "sending" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {paymentState.status === "signing" ? "Signing Transaction..." : "Sending Payment..."}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4" />
                          Pay {Number.parseFloat(amount).toFixed(2)} XLM
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center py-6"
                  key="wallet-connect"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6 text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        repeatDelay: 1,
                      }}
                    >
                      <Wallet className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-medium text-white">Connect Wallet</h3>
                    <p className="text-neutral-400 text-sm mt-2 mb-4">
                      Connect your Freighter wallet to make a payment
                    </p>
                    <div className="px-6 py-3 bg-neutral-900 rounded-lg mt-4 mb-4 border border-blue-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-300">Amount to Pay:</span>
                        <span className="text-lg font-semibold text-blue-400">
                          {Number.parseFloat(amount).toFixed(2)} XLM
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleConnectWallet}
                      disabled={paymentState.status === "connecting" || !freighterLoaded}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      {!freighterLoaded ? (
                        "Freighter Not Detected"
                      ) : paymentState.status === "connecting" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Connecting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4" />
                          Connect Wallet
                        </div>
                      )}
                    </Button>
                  </motion.div>

                  {!freighterLoaded && (
                    <div className="mt-4 text-sm text-amber-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>Freighter wallet extension not detected</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {paymentState.status === "success" && (
                <motion.div
                  className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-start gap-3 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Transaction Successful!</h4>
                    <p className="text-sm text-green-200 mt-1">
                      Your payment of {Number.parseFloat(amount).toFixed(2)} XLM has been sent.
                    </p>
                    <a href="#" className="text-sm flex items-center gap-1 text-blue-400 mt-2 hover:underline">
                      <ExternalLink className="h-3 w-3" />
                      View on Explorer
                    </a>
                  </div>
                </motion.div>
              )}

              {paymentState.status === "error" && (
                <motion.div
                  className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Transaction Failed</h4>
                    <p className="text-sm text-red-200 mt-1">{paymentState.errorMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-neutral-800 pt-4">
            <p className="text-xs text-neutral-500 text-center">
              Powered by Stellar Network •{" "}
              <a href="https://stellar.org" className="text-blue-400 hover:text-blue-300 transition-colors">
                Learn more
              </a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
