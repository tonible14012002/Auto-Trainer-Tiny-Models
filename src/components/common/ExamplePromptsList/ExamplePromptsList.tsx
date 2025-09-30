"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Copy, Check } from "lucide-react";
import { EXAMPLE_PROMPTS, type TaskWithExamples } from "@/constants/model";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExamplePromptsListProps {
  currentTask?: TaskWithExamples;
  onSelectPrompt?: (prompt: string) => void;
}

export const ExamplePromptsList = ({
  currentTask,
  onSelectPrompt,
}: ExamplePromptsListProps) => {
  const [copiedIndex, setCopiedIndex] = useState<{
    task: string;
    index: number;
  } | null>(null);

  const [task, setTask] = useState<string>(currentTask || "summarization");

  const handleCopy = async (text: string, task: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex({ task, index });
      toast.success("Prompt copied to clipboard");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err: any) {
      toast.error("Failed to copy prompt", {
        description: err?.message,
      });
    }
  };

  const taskLabels: Record<TaskWithExamples, string> = {
    summarization: "Summarization",
    "sentiment-analysis": "Sentiment Analysis",
    "zero-shot-classification": "Zero-Shot Classification",
    "token-classification": "Token Classification",
    "text-classification": "Text Classification",
    "automatic-speech-recognition": "Speech Recognition",
    "text2text-generation": "Text2Text Generation",
    "text-generation": "Text Generation",
  };

  // If currentTask is provided, show only prompts for that specific task without tabs
  if (currentTask) {
    const prompts = EXAMPLE_PROMPTS[currentTask] || [];

    return (
      <div className="">
        <ScrollArea className="h-[300px] w-full rounded-md [&_[data-radix-scroll-area-viewport]>div]:!block">
          <div className="space-y-3">
            {prompts.map((prompt, index) => (
              <div
                onClick={() => onSelectPrompt?.(prompt)}
                key={index}
                className={cn(
                  "flex items-start justify-between gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer active:scale-98 transition-all"
                )}
                style={{
                  wordBreak: "break-word",
                }}
              >
                <p
                  className={cn(
                    "text-sm flex-1 leading-relaxed break-words",
                    {
                      truncate: currentTask === "automatic-speech-recognition",
                    }
                  )}
                >
                  {prompt}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(prompt, currentTask, index);
                  }}
                  className="flex-shrink-0 h-8 w-8 p-0"
                >
                  {copiedIndex?.task === currentTask &&
                  copiedIndex?.index === index ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // If no currentTask is provided, show all tasks with tabs (original behavior)
  return (
    <div className="w-full">
      <Tabs defaultValue={task} className="w-full" onValueChange={setTask}>
        <ScrollArea className="overflow-x-auto">
          <TabsList className="max-w-full">
            {Object.entries(taskLabels).map(([task, label]) => (
              <TabsTrigger key={task} value={task} className="text-xs">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {Object.entries(EXAMPLE_PROMPTS).map(([task, prompts]) => (
          <TabsContent key={task} value={task} className="mt-2">
            {/* [data-radix-scroll-area-viewport] */}
            <ScrollArea className="h-[300px] w-full rounded-md [&_[data-radix-scroll-area-viewport]>div]:!block">
              <div className="space-y-3">
                {prompts.map((prompt, index) => (
                  <div
                    onClick={() => onSelectPrompt?.(prompt)}
                    key={index}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer active:scale-98 transition-all"
                    )}
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    <p
                      className={cn(
                        "text-sm flex-1 leading-relaxed break-words",
                        {
                          truncate: task === "automatic-speech-recognition",
                        }
                      )}
                    >
                      {prompt}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(prompt, task, index);
                      }}
                      className="flex-shrink-0 h-8 w-8 p-0"
                    >
                      {copiedIndex?.task === task &&
                      copiedIndex?.index === index ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
