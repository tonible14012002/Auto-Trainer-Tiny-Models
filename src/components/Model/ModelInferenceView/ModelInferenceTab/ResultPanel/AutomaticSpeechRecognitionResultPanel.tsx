"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AutomaticSpeechRecognitionResult } from "@/schema/model";
import { memo } from "react";

interface AutomaticSpeechRecognitionResultPanelProps {
  result?: AutomaticSpeechRecognitionResult;
  isPending: boolean;
}

export const AutomaticSpeechRecognitionResultPanel = memo((
  props: AutomaticSpeechRecognitionResultPanelProps
) => {
  const { result, isPending } = props;

  return (
    <div className="mt-4 rounded-lg overflow-hidden">
      {isPending && (
        <Progress indeterminate className="h-[2px] rounded-b-none" />
      )}
      <div
        className={cn(
          "bg-muted p-4 break-words flex flex-col gap-1 text-sm min-h-[100px]",
          {
            "animate-pulse": isPending,
          }
        )}
      >
        {result && (
          <div className="space-y-2">
            <p className="font-medium">Transcription:</p>
            <p className="text-muted-foreground leading-relaxed">
              {result.data.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

AutomaticSpeechRecognitionResultPanel.displayName = "AutomaticSpeechRecognitionResultPanel";
