"use client";

import { FileText, Brain, BarChart3, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TrainingSection } from "./TrainingSection";
import { EvaluationSection } from "./EvaluationSection";
import { GenerationSection } from "./GenerationSection";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { useFetchPhase } from "@/hooks/pipeline/phase/useFetchPhase";

dayjs.extend(relativeTime);

interface PhaseDetailCardProps {
  labelConfig?: Record<string, string>;
  phaseNumber?: number;
  phaseId: string;
  ignoreRefetch?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case "running":
    case "in_progress":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Running
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const PhaseDetailCard = ({
  phaseId,
  labelConfig,
  phaseNumber,
  ignoreRefetch,
}: PhaseDetailCardProps) => {
  const { data: { data: phase } = {}, isPending } = useFetchPhase(phaseId, {
    ignoreRefetch,
  });

  if (!phase || isPending) {
    return <div className=""></div>;
  }

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
                    {phase.dataset_files && phase.dataset_files.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              const ids = phase
                                .dataset_files!.map((d) => d.id)
                                .join("\n");
                              navigator.clipboard.writeText(ids);
                            }}
                          >
                            ID
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            {phase.dataset_files.map((d) => (
                              <div key={d.id}>{d.id}</div>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </>
                }
                defaultOpen={true}
                headerClassName="p-3 group"
              >
                <div className="p-3 border-t bg-accent/50">
                  <GenerationSection
                    phaseId={phase.id}
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
                    {phase.trained_models &&
                      phase.trained_models.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {phase.trained_models.length}
                        </Badge>
                      )}
                    {phase.trained_models &&
                      phase.trained_models.length > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                const ids = phase
                                  .trained_models!.map((m) => m.id)
                                  .join("\n");
                                navigator.clipboard.writeText(ids);
                              }}
                            >
                              ID
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs space-y-1">
                              {phase.trained_models.map((m) => (
                                <div key={m.id}>{m.id}</div>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                  </>
                }
                defaultOpen={true}
                headerClassName="p-3 group"
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
                    {phase.trained_models &&
                      phase.trained_models.some(
                        (m) => m.evaluation_results?.length > 0
                      ) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                const ids = phase
                                  .trained_models!.flatMap(
                                    (m) => m.evaluation_results || []
                                  )
                                  .map((e) => e.id)
                                  .join("\n");
                                navigator.clipboard.writeText(ids);
                              }}
                            >
                              ID
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs space-y-1">
                              {phase.trained_models
                                .flatMap((m) => m.evaluation_results || [])
                                .map((e) => (
                                  <div key={e.id}>{e.id}</div>
                                ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                  </>
                }
                defaultOpen={true}
                headerClassName="p-3 group"
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
