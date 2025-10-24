"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InferencerForm } from "./InferencerForm"

interface InferencerDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onInfer?: (input: string) => Promise<string>
  isLoading?: boolean
  title?: string
  description?: string
}

export function InferencerDialog({
  trigger,
  open,
  onOpenChange,
  onInfer,
  isLoading = false,
  title = "Model Inference",
  description = "Run inference on the checkpoint model",
}: InferencerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <InferencerForm onInfer={onInfer} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
