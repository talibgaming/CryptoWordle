"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trophy, Share2, Calendar, Coins } from "lucide-react"
import GameBoard from "@/components/game-board"
import ShareModal from "@/components/share-modal"
import { generateDailyWord, getGameStats, getDailyHint } from "@/lib/game-utils"

export default function CryptoWordle() {
  const router = useRouter()
  const [currentWord, setCurrentWord] = useState("")
  const [gameState, setGameState] = useState("playing") // playing, won, lost
  const [attempts, setAttempts] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)
  const [gameGrid, setGameGrid] = useState<string[][]>([])
  const [stats, setStats] = useState(getGameStats())
  const [showHint, setShowHint] = useState(false)
  const [dailyHint, setDailyHint] = useState("")

  useEffect(() => {
    // Initialize daily word and hint
    const dailyWord = generateDailyWord()
    setCurrentWord(dailyWord.toUpperCase())
    setDailyHint(getDailyHint())
  }, [])

  const handleGameComplete = (won: boolean, finalAttempts: number, grid: string[][]) => {
    setGameState(won ? "won" : "lost")
    setAttempts(finalAttempts)
    setGameGrid(grid)

    // Update stats
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: won ? stats.gamesWon + 1 : stats.gamesWon,
      currentStreak: won ? stats.currentStreak + 1 : 0,
      maxStreak: won ? Math.max(stats.maxStreak, stats.currentStreak + 1) : stats.maxStreak,
    }
    setStats(newStats)
    localStorage.setItem("wordleStats", JSON.stringify(newStats))
  }

  const handleClaimReward = () => {
    // Navigate to claim reward page with game data
    const params = new URLSearchParams({
      attempts: attempts.toString(),
      result: gameState,
      date: new Date().toLocaleDateString(),
    })
    router.push(`/claim-reward?${params.toString()}`)
  }

  const resetGame = () => {
    setGameState("playing")
    setAttempts(0)
    setGameGrid([])
    const dailyWord = generateDailyWord()
    setCurrentWord(dailyWord.toUpperCase())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Crypto Wordle
            </CardTitle>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Daily Challenge
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
                <div className="text-xs text-muted-foreground">Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}
                </div>
                <div className="text-xs text-muted-foreground">Win %</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Current</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.maxStreak}</div>
                <div className="text-xs text-muted-foreground">Max</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hint Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Need a hint?</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowHint(!showHint)} className="gap-2">
                <span className="text-lg">💡</span>
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>
            </div>
            {showHint && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-medium">Hint:</span> {dailyHint}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Board */}
        <GameBoard targetWord={currentWord} onGameComplete={handleGameComplete} gameState={gameState} />

        {/* Game Status */}
        {gameState !== "playing" && (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              {gameState === "won" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-green-600">Congratulations!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You solved it in {attempts} attempt{attempts !== 1 ? "s" : ""}!
                  </p>
                  <Badge variant="secondary" className="gap-1">
                    <Coins className="w-3 h-3" />
                    Crypto Reward Available
                  </Badge>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="font-semibold text-red-600">Game Over</span>
                  <p className="text-sm text-muted-foreground">
                    The word was: <span className="font-bold">{currentWord}</span>
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex gap-2 justify-center">
                {gameState === "won" && (
                  <Button onClick={handleClaimReward} className="gap-2">
                    <Coins className="w-4 h-4" />
                    Claim Reward
                  </Button>
                )}
                <Button variant="outline" onClick={() => setShowShareModal(true)} className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button variant="outline" onClick={resetGame}>
                  New Game
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          gameGrid={gameGrid}
          attempts={attempts}
          won={gameState === "won"}
        />
      </div>
    </div>
  )
}
