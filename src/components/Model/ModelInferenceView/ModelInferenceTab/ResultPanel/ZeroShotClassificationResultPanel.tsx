import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { ZeroShotClassificationResult } from "@/schema/model";

interface ZeroShotClassificationResultPanelProps {
  result?: ZeroShotClassificationResult;
  isPending: boolean;
}

export const ZeroShotClassificationResultPanel = (
  props: ZeroShotClassificationResultPanelProps
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
            <p className="text-sm text-muted-foreground">Classification results:</p>
            {result.data.labels.map((label, index) => (
              <div key={index} className="flex justify-between items-center py-1">
                <p className="font-medium">{label}</p>
                <p className="text-muted-foreground">
                  {result.data.scores[index].toFixed(4)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
