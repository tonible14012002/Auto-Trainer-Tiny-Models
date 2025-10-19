"use client";

import { PhaseDetail } from "@/schema/schema_v2";
import { FileText, Brain, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TrainingSection } from "./TrainingSection";
import { EvaluationSection } from "./EvaluationSection";
import { GenerationSection } from "./GenerationSection";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";

dayjs.extend(relativeTime);

interface PhaseDetailCardProps {
  phase: PhaseDetail;
  labelConfig?: Record<string, string>;
  phaseNumber?: number;
}

const formatDate = (date: string) => {
  try {
    return dayjs(date).fromNow();
  } catch {
    return date;
  }
};

const getStatusBadge = (status: string) => {
  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    completed: "default",
    running: "secondary",
    failed: "destructive",
    pending: "outline",
  };
  return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
};

export const PhaseDetailCard = ({
  phase,
  labelConfig,
  phaseNumber,
}: PhaseDetailCardProps) => {
  return (
    <Card className="p-0 gap-0 rounded-lg shadow-none overflow-hidden">
      <CardHeader className="gap-0 px-0">
        <CollapsibleSection
          header={
            <>
              <h3 className="text-sm font-semibold flex-1">
                {phaseNumber !== undefined
                  ? `Phase ${phaseNumber}`
                  : "Phase Details"}
              </h3>
              {getStatusBadge(phase.status)}
            </>
          }
          defaultOpen={true}
          chevronSize={16}
          headerClassName="p-3"
        >
          <CardContent className="px-0">
            {/* Second Level: Dataset/Generation Section */}
            <div className="border-t">
              <CollapsibleSection
                header={
                  <>
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-sm flex-1">Dataset</h4>
                    {phase.dataset_files && phase.dataset_files.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {phase.dataset_files.length}
                      </Badge>
                    )}
                  </>
                }
                defaultOpen={true}
                headerClassName="p-3"
              >
                <div className="p-3 border-t bg-accent/50">
                  <GenerationSection
                    phaseId={phase.id}
                    composalDatasets={phase.composal_datasets}
                    datasetFiles={phase.dataset_files}
                    labelConfig={labelConfig}
                  />
                </div>
              </CollapsibleSection>
            </div>

            {/* Second Level: Training Section */}
            <div className="border-t">
              <CollapsibleSection
                header={
                  <>
                    <Brain className="w-4 h-4 text-purple-600" />
                    <h4 className="font-medium text-sm flex-1">Training</h4>
                    {phase.trained_models && phase.trained_models.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {phase.trained_models.length}
                      </Badge>
                    )}
                  </>
                }
                defaultOpen={true}
                headerClassName="p-3"
                maxHeight="2000px"
              >
                <div className="p-3 border-t bg-accent/50">
                  <TrainingSection trainedModels={phase.trained_models} />
                </div>
              </CollapsibleSection>
            </div>

            {/* Second Level: Evaluation Section */}
            <div className="border-t">
              <CollapsibleSection
                header={
                  <>
                    <BarChart3 className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-sm flex-1">Evaluation</h4>
                  </>
                }
                defaultOpen={true}
                headerClassName="p-3"
                maxHeight="4000px"
              >
                <div className="p-3 border-t bg-accent/50">
                  <EvaluationSection
                    trainedModels={phase.trained_models}
                    labelConfig={labelConfig}
                  />
                </div>
              </CollapsibleSection>
            </div>
          </CardContent>
        </CollapsibleSection>
      </CardHeader>
    </Card>
  );
};
