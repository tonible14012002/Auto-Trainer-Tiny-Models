import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { SummarizerResult } from "@/schema/model";

interface SummarizeResultPanelProps {
  result?: SummarizerResult;
  isPending: boolean;
}

export const SummarizeResultPanel = (props: SummarizeResultPanelProps) => {
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
            <div className="" key={index}>
              {item.summary_text}
            </div>
          ))}
      </div>
    </div>
  );
};
