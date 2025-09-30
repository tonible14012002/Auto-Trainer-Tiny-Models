import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FileLoadInfo } from "@/schema/model";
import {
  formatReadableDurationInMs,
  formatReadableFileSize,
} from "@/utils/format";

export interface ModelFileLoadBoardProps {
  loadFileStatus: Record<string, FileLoadInfo>;
}

export const ModelFileLoadBoard = (props: ModelFileLoadBoardProps) => {
  const { loadFileStatus } = props;
  const isEmpty = Object.keys(loadFileStatus).length === 0;
  return (
    <ScrollArea className="flex flex-col gap-0.5 bg-accent min-h-[60px] rounded-md mb-1 text-xs -mx-1.5 px-1.5 py-2 -mt-2 text-accent-foreground/70 max-h-[80px] overflow-y-auto">
      {isEmpty && <div className="">waiting for load...</div>}
      {!isEmpty &&
        Object.entries(loadFileStatus).map(([fileName, info]) => (
          <div className="flex items-center gap-2" key={fileName}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate flex-1">{fileName}</span>
              </TooltipTrigger>
              <TooltipContent>{fileName}</TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-1">
              {formatReadableFileSize(info.loaded)} -{" "}
              {formatReadableDurationInMs(info.duration)}
            </div>
          </div>
        ))}
    </ScrollArea>
  );
};
