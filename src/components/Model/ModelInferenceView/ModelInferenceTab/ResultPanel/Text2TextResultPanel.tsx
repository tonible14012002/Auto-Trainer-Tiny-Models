
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Text2TextGenerationResult } from "@/schema/model";

interface Text2TextResultPanelProps {
  result?: Text2TextGenerationResult;
  isPending: boolean;
}

export const Text2TextResultPanel = (props: Text2TextResultPanelProps) => {
  const { result, isPending } = props;
  console.log({result})

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
            <p className="text-sm" key={index}>
              {item.generated_text}
            </p>
          ))}
      </div>
    </div>
  );
};
