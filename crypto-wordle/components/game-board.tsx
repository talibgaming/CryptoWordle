"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Delete, DoorOpenIcon as Enter } from "lucide-react"

interface GameBoardProps {
  targetWord: string
  onGameComplete: (won: boolean, attempts: number, grid: string[][]) => void
  gameState: string
}

export default function GameBoard({ targetWord, onGameComplete, gameState }: GameBoardProps) {
  const [currentGuess, setCurrentGuess] = useState("")
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentRow, setCurrentRow] = useState(0)

  const maxGuesses = 6
  const wordLength = 5

  const getLetterStatus = (letter: string, position: number, word: string) => {
    if (!targetWord) return "default"

    if (targetWord[position] === letter) {
      return "correct" // Green
    } else if (targetWord.includes(letter)) {
      return "present" // Yellow
    } else {
      return "absent" // Gray
    }
  }

  const handleKeyPress = (key: string) => {
    if (gameState !== "playing") return

    if (key === "ENTER") {
      if (currentGuess.length === wordLength) {
        submitGuess()
      }
    } else if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1))
    } else if (key.length === 1 && key.match(/[A-Z]/) && currentGuess.length < wordLength) {
      setCurrentGuess((prev) => prev + key)
    }
  }

  const submitGuess = () => {
    if (currentGuess.length !== wordLength) return

    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)
    setCurrentRow((prev) => prev + 1)
    setCurrentGuess("")

    // Create grid for sharing
    const grid = newGuesses.map((guess) =>
      guess.split("").map((letter, index) => getLetterStatus(letter, index, guess)),
    )

    // Check win condition
    if (currentGuess === targetWord) {
      onGameComplete(true, newGuesses.length, grid)
    } else if (newGuesses.length >= maxGuesses) {
      onGameComplete(false, newGuesses.length, grid)
    }
  }

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      if (key === "ENTER" || key === "BACKSPACE" || (key.length === 1 && key.match(/[A-Z]/))) {
        e.preventDefault()
        handleKeyPress(key)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentGuess, gameState])

  const renderGrid = () => {
    const grid = []

    for (let row = 0; row < maxGuesses; row++) {
      const cells = []

      for (let col = 0; col < wordLength; col++) {
        let letter = ""
        let status = "default"

        if (row < guesses.length) {
          // Completed row
          letter = guesses[row][col] || ""
          status = getLetterStatus(letter, col, guesses[row])
        } else if (row === currentRow) {
          // Current row
          letter = currentGuess[col] || ""
        }

        cells.push(
          <div
            key={`${row}-${col}`}
            className={`
              w-12 h-12 border-2 flex items-center justify-center font-bold text-lg
              ${
                status === "correct"
                  ? "bg-green-500 border-green-500 text-white"
                  : status === "present"
                    ? "bg-yellow-500 border-yellow-500 text-white"
                    : status === "absent"
                      ? "bg-gray-500 border-gray-500 text-white"
                      : letter
                        ? "border-gray-400"
                        : "border-gray-300"
              }
              ${row === currentRow && letter ? "animate-pulse" : ""}
            `}
          >
            {letter}
          </div>,
        )
      }

      grid.push(
        <div key={row} className="flex gap-1 justify-center">
          {cells}
        </div>,
      )
    }

    return grid
  }

  const keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ]

  const getKeyStatus = (key: string) => {
    if (key === "ENTER" || key === "BACKSPACE") return "default"

    for (const guess of guesses) {
      if (guess.includes(key)) {
        const positions = guess
          .split("")
          .map((letter, index) => (letter === key ? getLetterStatus(letter, index, guess) : null))
          .filter(Boolean)

        if (positions.includes("correct")) return "correct"
        if (positions.includes("present")) return "present"
        if (positions.includes("absent")) return "absent"
      }
    }
    return "default"
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {/* Game Grid */}
        <div className="space-y-1">{renderGrid()}</div>

        {/* Virtual Keyboard */}
        <div className="space-y-1">
          {keyboard.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1 justify-center">
              {row.map((key) => {
                const status = getKeyStatus(key)
                return (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleKeyPress(key)}
                    disabled={gameState !== "playing"}
                    className={`
                      ${key === "ENTER" || key === "BACKSPACE" ? "px-2" : "w-8 h-8 p-0"}
                      ${
                        status === "correct"
                          ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                          : status === "present"
                            ? "bg-yellow-500 border-yellow-500 text-white hover:bg-yellow-600"
                            : status === "absent"
                              ? "bg-gray-500 border-gray-500 text-white hover:bg-gray-600"
                              : ""
                      }
                    `}
                  >
                    {key === "BACKSPACE" ? (
                      <Delete className="w-4 h-4" />
                    ) : key === "ENTER" ? (
                      <Enter className="w-4 h-4" />
                    ) : (
                      key
                    )}
                  </Button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Hint reminder with guess counter (single instance) */}
        {gameState === "playing" && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Guess {currentRow + 1} of {maxGuesses}
            </div>
            <div className="text-xs text-muted-foreground">
              💡 Don't forget to check the hint above if you're stuck!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
