"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  gameGrid: string[][]
  attempts: number
  won: boolean
}

export default function ShareModal({ isOpen, onClose, gameGrid, attempts, won }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const generateShareText = () => {
    const today = new Date().toLocaleDateString()
    const result = won ? `${attempts}/6` : "X/6"

    let gridText = ""
    gameGrid.forEach((row) => {
      row.forEach((status) => {
        if (status === "correct") gridText += "🟩"
        else if (status === "present") gridText += "🟨"
        else gridText += "⬜"
      })
      gridText += "\n"
    })

    return `Crypto Wordle ${today} ${result}\n\n${gridText}\nPlay and earn crypto rewards! 🚀`
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleShareX = () => {
    const text = encodeURIComponent(generateShareText())
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  const handleShareWarpcast = () => {
    const text = encodeURIComponent(generateShareText())
    window.open(`https://warpcast.com/~/compose?text=${text}`, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Results
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <Card>
            <CardContent className="pt-4">
              <pre className="text-sm whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded">
                {generateShareText()}
              </pre>
            </CardContent>
          </Card>

          {/* Share buttons */}
          <div className="space-y-2">
            <Button onClick={handleCopy} variant="outline" className="w-full gap-2">
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleShareX} className="gap-2">
                <span className="font-bold">𝕏</span>
                Share on X
              </Button>
              <Button onClick={handleShareWarpcast} variant="outline" className="gap-2">
                <span className="text-purple-600">🟣</span>
                Warpcast
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Share your results and invite friends to play!
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
