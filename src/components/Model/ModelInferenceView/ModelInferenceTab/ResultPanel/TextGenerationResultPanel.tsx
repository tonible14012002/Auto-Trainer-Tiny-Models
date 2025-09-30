import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TextGenerationResult } from "@/schema/model";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface TextGenerationResultPanelProps {
  result?: TextGenerationResult;
  isPending: boolean;
}

export const TextGenerationResultPanel = (
  props: TextGenerationResultPanelProps
) => {
  const { result, isPending } = props;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Text copied to clipboard");
    } catch (err: any) {
      console.error(err);
      toast("Failed to copy text");
    }
  };

  return (
    <div className="mt-4 rounded-lg overflow-hidden">
      {isPending && (
        <Progress indeterminate className="h-[2px] rounded-b-none" />
      )}
      <div
        className={cn(
          "bg-muted p-4 break-words flex flex-col gap-3 text-sm min-h-[100px]",
          {
            "animate-pulse": isPending,
          }
        )}
      >
        {result && result.data.length > 0
          ? result.data.map((item, index) => (
              <div key={index} className="relative group">
                <div className="bg-background rounded-md p-3 border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Result {index + 1}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(item.generated_text)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed m-0">
                      {item.generated_text}
                    </p>
                  </div>
                </div>
              </div>
            ))
          : !isPending && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No results yet. Submit a request to see generated text.
              </div>
            )}
      </div>
    </div>
  );
};
