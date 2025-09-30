import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { SentimentAnalysisResult } from "@/schema/model";

interface SentimentAnalysisResultPanelProps {
  result?: SentimentAnalysisResult;
  isPending: boolean;
}

export const SentimentAnalysisResultPanel = (
  props: SentimentAnalysisResultPanelProps
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
        {result &&
          result.data.map((item, index) => (
            <div key={index}>
              <p className="font-medium">{item.label}</p>
              <p className="text-muted-foreground">{item.score}</p>
            </div>
          ))}
      </div>
    </div>
  );
};
