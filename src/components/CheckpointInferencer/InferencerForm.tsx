"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface InferencerFormProps {
  onInfer?: (input: string) => Promise<string>
  isLoading?: boolean
}

export function InferencerForm({ onInfer, isLoading = false }: InferencerFormProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [output, setOutput] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleInfer = async () => {
    if (!inputValue.trim()) return

    setLoading(true)
    try {
      if (onInfer) {
        const result = await onInfer(inputValue)
        setOutput(result)
      } else {
        // Placeholder for when API is not provided yet
        setOutput(`[Inference result for: "${inputValue}"]`)
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleInfer()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="inference-input">Input</Label>
        <div className="flex gap-2">
          <Input
            id="inference-input"
            placeholder="Enter text for inference..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleInfer}
            disabled={!inputValue.trim() || loading || isLoading}
          >
            {loading || isLoading ? "Running..." : "Run Inference"}
          </Button>
        </div>
      </div>

      {output !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm whitespace-pre-wrap break-words">
              {output}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
