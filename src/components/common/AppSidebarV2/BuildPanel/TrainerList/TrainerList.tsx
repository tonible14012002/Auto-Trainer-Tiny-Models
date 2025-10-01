"use client";

import { TrainerDetail } from "@/apis/trainer";
import { memo } from "react";
import { TrainerItem } from "./TrainerItem";
import { TrainerItemSkeleton } from "./TrainerItemSkeleton";

interface TrainerListProps {
  trainers?: TrainerDetail[];
  isLoading?: boolean;
  error?: Error | null;
  onClick?: (trainer: TrainerDetail) => void;
  selectedTrainerId?: number;
}

export const TrainerList = memo((props: TrainerListProps) => {
  const { trainers, isLoading, error, onClick, selectedTrainerId } = props;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <TrainerItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive text-center py-4">
        Failed to load trainers
      </p>
    );
  }

  if (!trainers || trainers.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No trainers found
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {trainers.map((trainer) => (
        <TrainerItem
          key={trainer.id}
          trainer={trainer}
          onClick={onClick}
          isSelected={selectedTrainerId === trainer.id}
        />
      ))}
    </div>
  );
});

TrainerList.displayName = "TrainerList";
