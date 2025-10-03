"use client";

import React from "react";
import { TrainerDetail } from "@/schema/schema";

interface DatasetTabProps {
  trainerDetail: TrainerDetail;
}

export const DatasetTab: React.FC<DatasetTabProps> = ({ trainerDetail }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Dataset</h2>
      <p className="text-muted-foreground">
        Dataset tab content - displaying training dataset information
      </p>
    </div>
  );
};
