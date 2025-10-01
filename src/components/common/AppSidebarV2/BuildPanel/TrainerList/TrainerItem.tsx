"use client";

import { TrainerDetail } from "@/apis/trainer";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface TrainerItemProps {
  trainer: TrainerDetail;
  className?: string;
  onClick?: (trainer: TrainerDetail) => void;
  isSelected?: boolean;
}

export const TrainerItem = memo((props: TrainerItemProps) => {
  const { trainer, className, onClick, isSelected } = props;

  const handleClick = () => {
    onClick?.(trainer);
  };

  return (
    <div
      className={cn(
        "p-3 rounded-lg border bg-card hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer",
        isSelected && "bg-accent",
        className
      )}
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-sm line-clamp-1">{trainer.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(trainer.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
});

TrainerItem.displayName = "TrainerItem";