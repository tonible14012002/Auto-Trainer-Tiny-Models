"use client";

import { cn } from "@/lib/utils";
import { memo } from "react";

interface TrainerItemSkeletonProps {
  className?: string;
}

export const TrainerItemSkeleton = memo((props: TrainerItemSkeletonProps) => {
  const { className } = props;

  return (
    <div
      className={cn(
        "p-3 rounded-lg border bg-card animate-pulse",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-5/6" />
        <div className="h-3 bg-muted rounded w-1/3 mt-1" />
      </div>
    </div>
  );
});

TrainerItemSkeleton.displayName = "TrainerItemSkeleton";
