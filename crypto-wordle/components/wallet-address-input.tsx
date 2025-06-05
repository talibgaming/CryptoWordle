"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clipboard, AlertTriangle, Wallet } from "lucide-react"

interface WalletAddressInputProps {
  value: string
  onChange: (value: string) => void
  onValidationChange: (isValid: boolean) => void
  placeholder?: string
  disabled?: boolean
}

export default function WalletAddressInput({
  value,
  onChange,
  onValidationChange,
  placeholder = "0x1234567890abcdef1234567890abcdef12345678",
  disabled = false,
}: WalletAddressInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [validationState, setValidationState] = useState<"idle" | "valid" | "invalid">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [showPasteSuccess, setShowPasteSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Ethereum address validation
  const validateEthereumAddress = (address: string): { isValid: boolean; error?: string } => {
    const cleanAddress = address.trim()

    if (!cleanAddress) {
      return { isValid: false, error: "Wallet address is required" }
    }

    if (!cleanAddress.startsWith("0x")) {
      return { isValid: false, error: "Address must start with '0x'" }
    }

    if (cleanAddress.length !== 42) {
      const currentLength = cleanAddress.length
      if (currentLength < 42) {
        return { isValid: false, error: `Address too short: ${currentLength}/42 characters` }
      } else {
        return { isValid: false, error: `Address too long: ${currentLength}/42 characters` }
      }
    }

    const hexPart = cleanAddress.slice(2)
    const hexRegex = /^[0-9a-fA-F]+$/
    if (!hexRegex.test(hexPart)) {
      return { isValid: false, error: "Invalid characters. Only 0-9, a-f, A-F allowed after '0x'" }
    }

    return { isValid: true }
  }

  // Simple input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Validate
    if (!newValue.trim()) {
      setValidationState("idle")
      setErrorMessage("")
      onValidationChange(false)
      return
    }

    const validation = validateEthereumAddress(newValue)
    if (validation.isValid) {
      setValidationState("valid")
      setErrorMessage("")
      onValidationChange(true)
    } else {
      setValidationState("invalid")
      setErrorMessage(validation.error || "Invalid address format")
      onValidationChange(false)
    }
  }

  // Simple paste handler
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Let the default paste behavior work
    const pastedText = e.clipboardData.getData("text")
    if (pastedText) {
      setShowPasteSuccess(true)
      setTimeout(() => setShowPasteSuccess(false), 2000)
    }
  }

  // Paste button - just focus and instruct user
  const handlePasteButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()

      // Create a temporary text area to try clipboard access
      const textArea = document.createElement("textarea")
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        // Try to execute paste command
        const successful = document.execCommand("paste")
        if (successful) {
          // Get the pasted content
          setTimeout(() => {
            const pastedValue = textArea.value
            if (pastedValue) {
              onChange(pastedValue)
              setShowPasteSuccess(true)
              setTimeout(() => setShowPasteSuccess(false), 2000)
            }
            document.body.removeChild(textArea)
            inputRef.current?.focus()
          }, 10)
        } else {
          document.body.removeChild(textArea)
          inputRef.current?.focus()
          alert("Please use Ctrl+V (or Cmd+V on Mac) to paste your wallet address")
        }
      } catch (err) {
        document.body.removeChild(textArea)
        inputRef.current?.focus()
        alert("Please use Ctrl+V (or Cmd+V on Mac) to paste your wallet address")
      }
    }
  }

  // Get input styling
  const getInputClassName = () => {
    let classes = "font-mono text-sm pr-12 transition-colors"

    if (disabled) {
      classes += " opacity-50 cursor-not-allowed"
    }

    switch (validationState) {
      case "valid":
        return `${classes} border-green-500 focus:border-green-600 focus:ring-green-500`
      case "invalid":
        return `${classes} border-red-500 focus:border-red-600 focus:ring-red-500`
      default:
        return classes
    }
  }

  // Get status icon
  const getStatusIcon = () => {
    switch (validationState) {
      case "valid":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "invalid":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Wallet className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-3">
      {/* Input Container */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleChange}
              onPaste={handlePaste}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              className={getInputClassName()}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />

            {/* Status Icon */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">{getStatusIcon()}</div>
          </div>

          {/* Paste Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePasteButtonClick}
            disabled={disabled}
            className="px-3 gap-2 shrink-0"
          >
            {showPasteSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                Pasted!
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4" />
                Paste
              </>
            )}
          </Button>
        </div>

        {/* Character Counter */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-muted-foreground">{value.length}/42 characters</div>

          {/* Status Badge */}
          {validationState !== "idle" && (
            <Badge variant={validationState === "valid" ? "default" : "destructive"} className="text-xs">
              {validationState === "valid" ? "Valid" : "Invalid"}
            </Badge>
          )}
        </div>
      </div>

      {/* Error Message */}
      {validationState === "invalid" && errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {validationState === "valid" && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-sm text-green-800 dark:text-green-200">
            Valid Base chain wallet address
          </AlertDescription>
        </Alert>
      )}

      {/* Instructions */}
      <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
        <p className="font-medium mb-1">How to enter your wallet address:</p>
        <p>• Type directly in the field above</p>
        <p>• Copy your address and use Ctrl+V (Cmd+V on Mac) to paste</p>
        <p>• Address must start with '0x' and be exactly 42 characters</p>
      </div>
    </div>
  )
}
