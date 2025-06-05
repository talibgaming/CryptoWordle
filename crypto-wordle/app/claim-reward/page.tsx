"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Wallet, Trophy, CheckCircle, ArrowLeft, User, Gamepad2 } from "lucide-react"
import { sendCryptoReward } from "@/lib/crypto-utils"
import WalletAddressInput from "@/components/wallet-address-input"

const cryptoOptions = [
  { symbol: "ETH", name: "Ethereum", amount: "0.001", icon: "⟠" },
  { symbol: "USDC", name: "USD Coin", amount: "2.50", icon: "💵" },
  { symbol: "DEGEN", name: "Degen", amount: "100", icon: "🎩" },
  { symbol: "HIGHER", name: "Higher", amount: "50", icon: "📈" },
]

export default function ClaimRewardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get game data from URL parameters
  const attempts = Number.parseInt(searchParams.get("attempts") || "1")
  const gameResult = searchParams.get("result") || "won"
  const gameDate = searchParams.get("date") || new Date().toLocaleDateString()

  // Form state
  const [selectedCrypto, setSelectedCrypto] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [isAddressValid, setIsAddressValid] = useState(false)
  const [gamingName, setGamingName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [nameError, setNameError] = useState("")

  // Validate gaming name
  const validateGamingName = (name: string): boolean => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setNameError("Gaming name is required")
      return false
    }
    if (trimmedName.length < 2) {
      setNameError("Gaming name must be at least 2 characters")
      return false
    }
    if (trimmedName.length > 20) {
      setNameError("Gaming name must be less than 20 characters")
      return false
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedName)) {
      setNameError("Gaming name can only contain letters, numbers, underscores, and hyphens")
      return false
    }
    setNameError("")
    return true
  }

  // Handle gaming name change
  const handleGamingNameChange = (value: string) => {
    setGamingName(value)
    validateGamingName(value)
  }

  // Calculate reward multiplier
  const getRewardMultiplier = () => {
    if (attempts <= 2) return 2
    if (attempts <= 4) return 1.5
    return 1
  }

  // Handle reward claim
  const handleClaimReward = async () => {
    if (!selectedCrypto || !walletAddress || !isAddressValid || !validateGamingName(gamingName)) {
      return
    }

    setIsProcessing(true)

    try {
      const result = await sendCryptoReward(selectedCrypto, walletAddress, attempts, gamingName)
      setTxHash(result.txHash)
      setIsCompleted(true)

      // Redirect back to game after 5 seconds
      setTimeout(() => {
        router.push("/")
      }, 5000)
    } catch (error) {
      console.error("Failed to send reward:", error)
      setIsProcessing(false)
    }
  }

  // Go back to game
  const handleGoBack = () => {
    router.push("/")
  }

  // Check if form is valid
  const isFormValid = selectedCrypto && walletAddress && isAddressValid && gamingName.trim() && !nameError

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleGoBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Game
              </Button>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Claim Your Crypto Reward!
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Congratulations on completing today's Crypto Wordle challenge!
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {!isCompleted ? (
          <div className="space-y-6">
            {/* Game Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Game Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{attempts}</div>
                    <div className="text-xs text-muted-foreground">Attempts</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{getRewardMultiplier()}x</div>
                    <div className="text-xs text-muted-foreground">Bonus</div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="text-sm font-bold text-purple-600">{gameDate}</div>
                    <div className="text-xs text-muted-foreground">Date</div>
                  </div>
                </div>
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm text-green-800 dark:text-green-200">
                    Excellent performance! You've earned a {getRewardMultiplier()}x bonus multiplier for solving in{" "}
                    {attempts} attempt{attempts !== 1 ? "s" : ""}!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Gaming Name Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Gaming Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gaming-name">Your Gaming Name</Label>
                  <Input
                    id="gaming-name"
                    type="text"
                    value={gamingName}
                    onChange={(e) => handleGamingNameChange(e.target.value)}
                    placeholder="Enter your gaming name (e.g., CryptoMaster123)"
                    disabled={isProcessing}
                    className={nameError ? "border-red-500 focus:border-red-500" : ""}
                    maxLength={20}
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">{gamingName.length}/20 characters</div>
                    {!nameError && gamingName.trim() && (
                      <Badge variant="default" className="text-xs">
                        ✓ Valid Name
                      </Badge>
                    )}
                  </div>
                  {nameError && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-sm">{nameError}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <p className="font-medium mb-1">Gaming name requirements:</p>
                  <p>• 2-20 characters long</p>
                  <p>• Letters, numbers, underscores (_), and hyphens (-) only</p>
                  <p>• Will be associated with your reward transaction</p>
                </div>
              </CardContent>
            </Card>

            {/* Crypto Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Your Reward</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
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
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">{crypto.icon}</div>
                        <div className="font-semibold">{crypto.symbol}</div>
                        <div className="text-sm text-muted-foreground">{crypto.name}</div>
                        <div className="text-lg font-bold text-green-600 mt-1">
                          {(Number.parseFloat(crypto.amount) * getRewardMultiplier()).toFixed(
                            crypto.symbol === "USDC" ? 2 : 3,
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wallet Address Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Base Wallet Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WalletAddressInput
                  value={walletAddress}
                  onChange={setWalletAddress}
                  onValidationChange={setIsAddressValid}
                  disabled={isProcessing}
                />
              </CardContent>
            </Card>

            {/* Claim Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={handleClaimReward}
                  disabled={!isFormValid || isProcessing}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Transaction...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5 mr-2" />
                      Claim {selectedCrypto} Reward
                    </>
                  )}
                </Button>
                <div className="text-xs text-muted-foreground text-center mt-2">
                  Transaction will be processed on Base chain
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Success State */
          <Card>
            <CardContent className="text-center space-y-6 py-12">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-green-600">Reward Sent Successfully!</h2>
                <p className="text-muted-foreground">Your {selectedCrypto} reward has been sent to your Base wallet.</p>
                <div className="space-y-2">
                  <Badge variant="outline" className="font-mono text-sm px-4 py-2">
                    {txHash}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Gaming Name: <span className="font-medium">{gamingName}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Redirecting back to game in 5 seconds...</div>
              <Button onClick={handleGoBack} variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return to Game Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
