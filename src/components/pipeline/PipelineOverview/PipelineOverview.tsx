"use client";

import React from "react";
import { PipelineDetail } from "@/schema/schema_v2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { LabelInfoDialog } from "@/components/pipeline/LabelInfoDialog/LabelInfoDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PipelineOverviewProps {
  pipelineDetail: PipelineDetail;
}

export const PipelineOverview: React.FC<PipelineOverviewProps> = ({
  pipelineDetail,
}) => {
  return (
    <div className="space-y-3">
      {/* Label Configuration Detail */}
      <div className="p-2.5 border rounded-lg bg-white space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium">
            Label Configuration
          </div>
          <LabelInfoDialog
            labelConfig={pipelineDetail.label_config}
            trigger={
              <Button variant="outline" size="sm" className="h-6 text-xs">
                <Info className="w-3 h-3 mr-1" />
                Details
              </Button>
            }
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(pipelineDetail.label_config.id2label).map(
            ([id, label]) => (
              <Tooltip key={id} delayDuration={400}>
                <TooltipTrigger asChild>
                  <Badge key={id} variant="outline" className="font-mono">
                    {label}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-[80vw] md:max-w-md">
                    {pipelineDetail.label_config.label_explanation[label] ||
                      "No explanation available"}
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          )}
        </div>
      </div>
    </div>
  );
};
