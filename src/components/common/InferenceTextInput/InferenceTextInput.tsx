"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface InferenceTextInputProps extends React.ComponentProps<"textarea"> {
  rightEl?: React.ReactNode;
}

export const InferenceTextInput = React.forwardRef<
  HTMLTextAreaElement,
  InferenceTextInputProps
>(({ className, rightEl, ...props }, ref) => {
  return (
    <div className="relative">
      <Textarea
        ref={ref}
        className={cn("pr-12", className)}
        {...props}
      />
      {rightEl && (
        <div className="absolute bottom-2 right-2">
          {rightEl}
        </div>
      )}
    </div>
  );
});

InferenceTextInput.displayName = "InferenceTextInput";