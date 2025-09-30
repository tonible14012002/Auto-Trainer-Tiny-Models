"use client";

import { TrainerDetail } from "@/apis/trainer";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface TrainerItemProps {
  trainer: TrainerDetail;
  className?: string;
  onClick?: (trainer: TrainerDetail) => void;
}

export const TrainerItem = memo((props: TrainerItemProps) => {
  const { trainer, className, onClick } = props;

  const handleClick = () => {
    onClick?.(trainer);
  };

  return (
    <div
      className={cn(
        "p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-sm line-clamp-1">{trainer.name}</h3>
        {trainer.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {trainer.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(trainer.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
});

TrainerItem.displayName = "TrainerItem";