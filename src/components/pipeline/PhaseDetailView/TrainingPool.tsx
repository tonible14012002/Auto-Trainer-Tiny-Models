"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Database } from "lucide-react";
import { useState } from "react";
import { DatasetView } from "@/components/pipeline/DatasetView";
import { useFetchTrainingPoolData } from "@/hooks/pipeline/useFetchTrainingPoolData";
import { PhaseDetail } from "@/schema/schema_v2";

interface TrainingPoolProps {
  phaseId: string;
  composalDatasets: PhaseDetail["composal_datasets"];
  labelConfig?: Record<string, string>;
}

export const TrainingPool: React.FC<TrainingPoolProps> = ({
  phaseId,
  composalDatasets,
  labelConfig,
}) => {
  const [showDatasetView, setShowDatasetView] = useState(false);
  const { data: { data: trainingPoolData } = {}, isLoading } =
    useFetchTrainingPoolData(phaseId);

  if (!composalDatasets || composalDatasets.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 gap-0 rounded-lg shadow-none">
      <div className="flex items-center gap-2 pb-4">
        <div className="flex items-center gap-2 flex-1">
          <Database className="text-blue-600" size={16} />
          <CardTitle className="text-sm">Training Pool</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="toggle-dataset-view"
            className="cursor-pointer text-sm text-muted-foreground"
          >
            Dataset View
          </Label>
          <Switch
            id="toggle-dataset-view"
            checked={showDatasetView}
            onCheckedChange={setShowDatasetView}
          />
        </div>
      </div>
      <CardContent className="p-0">
        {showDatasetView ? (
          isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading training pool data...
            </div>
          ) : trainingPoolData?.samples &&
            trainingPoolData.samples.length > 0 ? (
            <DatasetView
              samples={trainingPoolData.samples}
              labelConfig={labelConfig}
            />
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No training pool data available
            </div>
          )
        ) : null}
      </CardContent>
    </Card>
  );
};
