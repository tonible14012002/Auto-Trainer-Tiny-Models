"use client";

import React from "react";
import { TrainerDetail } from "@/schema/schema";

interface IterationTabProps {
  trainerDetail: TrainerDetail;
}

export const IterationTab: React.FC<IterationTabProps> = ({ trainerDetail }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Iteration</h2>
      <p className="text-muted-foreground">
        Iteration tab content - displaying training iterations and progress
      </p>
    </div>
  );
};
