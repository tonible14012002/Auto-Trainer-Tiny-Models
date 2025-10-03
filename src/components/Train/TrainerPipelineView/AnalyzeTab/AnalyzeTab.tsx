"use client";

import React from "react";
import { TrainerDetail } from "@/schema/schema";

interface AnalyzeTabProps {
  trainerDetail: TrainerDetail;
}

export const AnalyzeTab: React.FC<AnalyzeTabProps> = ({ trainerDetail }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Analyze</h2>
      <p className="text-muted-foreground">
        Analyze tab content - displaying model analysis and metrics
      </p>
    </div>
  );
};
