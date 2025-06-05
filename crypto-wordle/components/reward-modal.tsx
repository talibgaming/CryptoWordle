"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wallet, Trophy, CheckCircle } from "lucide-react"
import { sendCryptoReward } from "@/lib/crypto-utils"
import WalletAddressInput from "@/components/wallet-address-input"

interface RewardModalProps {
  isOpen: boolean
  onClose: () => void
  onRewardClaimed: () => void
  attempts: number
}

const cryptoOptions = [
  { symbol: "ETH", name: "Ethereum", amount: "0.001", icon: "⟠" },
  { symbol: "USDC", name: "USD Coin", amount: "2.50", icon: "💵" },
  { symbol: "DEGEN", name: "Degen", amount: "100", icon: "🎩" },
  { symbol: "HIGHER", name: "Higher", amount: "50", icon: "📈" },
]

export default function RewardModal({ isOpen, onClose, onRewardClaimed, attempts }: RewardModalProps) {
  const [selectedCrypto, setSelectedCrypto] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [isAddressValid, setIsAddressValid] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [txHash, setTxHash] = useState("")

  const handleClaimReward = async () => {
    if (!selectedCrypto || !walletAddress || !isAddressValid) return

    setIsProcessing(true)

    try {
      // Simulate crypto transaction
      const result = await sendCryptoReward(selectedCrypto, walletAddress, attempts)
      setTxHash(result.txHash)
      setIsCompleted(true)

      setTimeout(() => {
        onRewardClaimed()
        handleClose()
      }, 3000)
    } catch (error) {
      console.error("Failed to send reward:", error)
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setSelectedCrypto("")
    setWalletAddress("")
    setIsAddressValid(false)
    setIsProcessing(false)
    setIsCompleted(false)
    setTxHash("")
    onClose()
  }

  const getRewardMultiplier = () => {
    if (attempts <= 2) return 2
    if (attempts <= 4) return 1.5
    return 1
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Claim Your Crypto Reward!
          </DialogTitle>
        </DialogHeader>

        {!isCompleted ? (
          <div className="space-y-6">
            {/* Performance bonus */}
            <Card>
              <CardContent className="pt-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">{getRewardMultiplier()}x Bonus!</div>
                  <div className="text-sm text-muted-foreground">
                    Solved in {attempts} attempt{attempts !== 1 ? "s" : ""}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Crypto selection */}
            <div className="space-y-3">
              <Label>Select your reward cryptocurrency:</Label>
              <div className="grid grid-cols-2 gap-2">
                {cryptoOptions.map((crypto) => (
                  <Card
                    key={crypto.symbol}
                    className={`cursor-pointer transition-all ${
                      selectedCrypto === crypto.symbol
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedCrypto(crypto.symbol)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl mb-1">{crypto.icon}</div>
                      <div className="font-semibold text-sm">{crypto.symbol}</div>
                      <div className="text-xs text-muted-foreground">
                        {(Number.parseFloat(crypto.amount) * getRewardMultiplier()).toFixed(
                          crypto.symbol === "USDC" ? 2 : 3,
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Enhanced Wallet Address Input */}
            <div className="space-y-2">
              <Label htmlFor="wallet">Your Base wallet address:</Label>
              <WalletAddressInput
                value={walletAddress}
                onChange={setWalletAddress}
                onValidationChange={setIsAddressValid}
                disabled={isProcessing}
              />
            </div>

            {/* Claim button */}
            <Button
              onClick={handleClaimReward}
              disabled={!selectedCrypto || !walletAddress || !isAddressValid || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Transaction...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Claim Reward
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center">Transaction will be processed on Base chain</div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-600">Reward Sent Successfully!</h3>
              <p className="text-sm text-muted-foreground">
                Your {selectedCrypto} reward has been sent to your wallet.
              </p>
              <Badge variant="outline" className="font-mono text-xs">
                {txHash}
              </Badge>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
