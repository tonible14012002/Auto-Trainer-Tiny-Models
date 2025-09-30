import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { TokenClassificationResult } from "@/schema/model";
import { Badge } from "@/components/ui/badge";

interface TokenClassificationResultPanelProps {
  result?: TokenClassificationResult;
  isPending: boolean;
}

export const TokenClassificationResultPanel = (
  props: TokenClassificationResultPanelProps
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
            <div key={index} className="border-b border-border/50 pb-2 last:border-b-0">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary">{item.word}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.entity}
                  </Badge>
                </div>
                <span className="text-muted-foreground text-xs">
                  {(item.score * 100).toFixed(2)}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Token Index: {item.index}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
