"use client";

import React, { memo } from "react";
import { type ModelDetail } from "@/schema/model";
import { DownloadIcon, TimerIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTotalFileInfo } from "@/utils/model";
import {
  formatReadableDurationInMs,
  formatReadableFileSize,
} from "@/utils/format";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

type ModelItemProps = {
  isSelected?: boolean;
  modelDetail: ModelDetail;
  onSelect: (modelId: string) => void;
};

export const ModelItem: React.FC<ModelItemProps> = memo(
  ({ modelDetail, onSelect, isSelected }) => {
    const fileInfo = getTotalFileInfo(modelDetail.loadFiles || {});

    return (
      <div
        className={cn("rounded-md overflow-hidden border", {
          "border-blue-200": modelDetail.loaded,
        })}
      >
        {modelDetail.loading && <Progress className="h-[2px]" indeterminate />}
        <div
          className={cn(
            "w-full p-2 transition-colors cursor-pointer active:bg-accent",
            {
              "hover:bg-accent": !modelDetail.loaded,
              "bg-blue-100/50": modelDetail.loaded,
              "bg-accent": isSelected,
              "animate-pulse": modelDetail.loading,
            }
          )}
          onClick={() => onSelect(modelDetail.id)}
        >
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-0.5">
              <p className="text-sm font-medium line-clamp-2">
                {modelDetail.name}
              </p>
              <span className="text-xs text-muted-foreground mt-px">
                {modelDetail.task ?? "No task assigned"}
              </span>
              <Badge variant="outline" className="mt-1">
                Dtype: {modelDetail.dtype || "auto"}
              </Badge>
              {modelDetail.loadTime ? (
                <div className="progress-group flex flex-col mt-2">
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <TimerIcon size={12} />
                    Load time:{" "}
                    {formatReadableDurationInMs(modelDetail.loadTime)}
                  </p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <DownloadIcon size={12} />
                    Download time:{" "}
                    {formatReadableDurationInMs(fileInfo.totalDownloadTime)}
                  </p>
                </div>
              ) : (
                <div>
                  <Badge variant="secondary" className="mt-2">
                    Not loaded yet
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              {Boolean(fileInfo.totalSize) && (
                <Badge>{formatReadableFileSize(fileInfo.totalSize)}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ModelItem.displayName = "ModelItem";
