"use client";

import {
  TrainedModelInfo,
  LabelEvaluation,
  LowConfidentSample,
} from "@/schema/schema_v2";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { DatasetView } from "../DatasetView";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

dayjs.extend(relativeTime);

interface EvaluationSectionProps {
  trainedModels?: TrainedModelInfo[];
  labelConfig?: Record<string, string>;
}

// Create columns for low confidence predictions
const createLowConfidenceColumns = (): ColumnDef<LowConfidentSample, any>[] => [
  {
    id: "index",
    header: "ID",
    cell: (info) => {
      return (
        <div className="text-sm text-muted-foreground font-mono">
          {(info.row.original as any)._index}
        </div>
      );
    },
  },
  {
    accessorKey: "text",
    header: "Text",
    cell: (info) => {
      const text = info.getValue() as string;
      return (
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <div className="max-w-[300px] text-sm break-words cursor-default">
              {text}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-md break-words">
            <p className="text-xs">{text}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "true_label",
    header: "True Label",
    cell: (info) => {
      const label = info.getValue() as string;
      return <Badge variant="outline">{label}</Badge>;
    },
  },
  {
    accessorKey: "predicted_label",
    header: "Predicted",
    cell: (info) => {
      const label = info.getValue() as string;
      return <Badge variant="secondary">{label}</Badge>;
    },
  },
  {
    accessorKey: "probability",
    header: "Confidence",
    cell: (info) => {
      const probability = info.getValue() as number;
      return (
        <span
          className={
            probability < 0.5
              ? "text-red-600 font-medium"
              : "text-amber-600 font-medium"
          }
        >
          {(probability * 100).toFixed(1)}%
        </span>
      );
    },
  },
];

export const EvaluationSection = ({
  trainedModels,
  labelConfig,
}: EvaluationSectionProps) => {
  const [showLowConfidence, setShowLowConfidence] = useState(false);

  const hasEvaluations = trainedModels?.some(
    (m) => m.evaluation_results?.length > 0
  );

  if (!hasEvaluations) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No evaluation results available
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {trainedModels?.map(
        (model) =>
          model.evaluation_results &&
          model.evaluation_results.length > 0 && (
            <div key={model.id} className="space-y-3">
              {/* Model Information Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {model.model_name}
                      </h3>
                      <Badge
                        variant={model.status === "completed" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {model.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">Model ID:</span>
                        <span className="font-mono text-xs">{model.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">Created:</span>
                        <span>{dayjs(model.created_at).fromNow()}</span>
                      </div>
                      {model.completed_at && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">Completed:</span>
                          <span>{dayjs(model.completed_at).fromNow()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {model.evaluation_results.map((evaluation) => (
                <div key={evaluation.id} className="p-0">
                  {(() => {
                    // Extract recent_low_confidence_on_train and label metrics
                    const { recent_low_confidence_on_train, ...labelMetrics } =
                      evaluation.label_metrics || {};

                    return (
                      <>
                        {/* Overall Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border">
                            <div className="text-xs text-muted-foreground mb-1">
                              Accuracy
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              {(evaluation.accuracy * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border">
                            <div className="text-xs text-muted-foreground mb-1">
                              Precision
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              {(evaluation.precision * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg border">
                            <div className="text-xs text-muted-foreground mb-1">
                              Recall
                            </div>
                            <div className="text-2xl font-bold text-orange-600">
                              {(evaluation.recall * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg border">
                            <div className="text-xs text-muted-foreground mb-1">
                              F1 Score
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                              {(evaluation.f1_score * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        {/* Per-Label Metrics */}
                        {Object.keys(labelMetrics).length > 0 && (
                          <div className="space-y-3">
                            <div className="border rounded-lg overflow-x-auto w-full">
                              <div className="min-w-max">
                                <Table className="bg-white">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="font-medium">
                                      Label
                                    </TableHead>
                                    <TableHead className="font-medium">
                                      Accuracy
                                    </TableHead>
                                    <TableHead className="font-medium">
                                      Precision
                                    </TableHead>
                                    <TableHead className="font-medium">
                                      Recall
                                    </TableHead>
                                    <TableHead className="font-medium">
                                      F1 Score
                                    </TableHead>
                                    <TableHead className="font-medium">
                                      Samples
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {Object.entries(labelMetrics).map(
                                    ([labelId, metrics]) => {
                                      const labelMetric =
                                        metrics as LabelEvaluation;
                                      return (
                                        <TableRow key={labelId}>
                                          <TableCell className="font-medium">
                                            <Badge variant="outline">
                                              {labelConfig?.[labelId] ||
                                                `${labelId}`}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            {(
                                              labelMetric.accuracy * 100
                                            ).toFixed(1)}
                                            %
                                          </TableCell>
                                          <TableCell>
                                            {(
                                              labelMetric.precision * 100
                                            ).toFixed(1)}
                                            %
                                          </TableCell>
                                          <TableCell>
                                            {(labelMetric.recall * 100).toFixed(
                                              1
                                            )}
                                            %
                                          </TableCell>
                                          <TableCell>
                                            {(
                                              labelMetric.f1_score * 100
                                            ).toFixed(1)}
                                            %
                                          </TableCell>
                                          <TableCell>
                                            <Tooltip delayDuration={300}>
                                              <TooltipTrigger asChild>
                                                <Badge
                                                  variant="outline"
                                                  className="cursor-help"
                                                >
                                                  {labelMetric.samples}
                                                </Badge>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <div className="text-xs space-y-1">
                                                  <div className="font-semibold mb-1">Confusion Matrix:</div>
                                                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                                                    <span className="text-green-600">True Positives:</span>
                                                    <span className="font-mono">{labelMetric.true_positives}</span>
                                                    <span className="text-red-600">False Positives:</span>
                                                    <span className="font-mono">{labelMetric.false_positives}</span>
                                                    <span className="text-green-600">True Negatives:</span>
                                                    <span className="font-mono">{labelMetric.true_negatives}</span>
                                                    <span className="text-red-600">False Negatives:</span>
                                                    <span className="font-mono">{labelMetric.false_negatives}</span>
                                                  </div>
                                                </div>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    }
                                  )}
                                </TableBody>
                              </Table>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Low Confidence Samples */}
                        {recent_low_confidence_on_train?.samples?.length >
                          0 && (
                          <div className="space-y-3 mt-6">
                            <button
                              onClick={() => setShowLowConfidence(!showLowConfidence)}
                              className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                            >
                              {showLowConfidence ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                              Low Confidence Predictions
                              <Badge variant="outline">
                                {recent_low_confidence_on_train.count}
                              </Badge>
                            </button>
                            {showLowConfidence && (
                              <DatasetView<LowConfidentSample>
                                samples={recent_low_confidence_on_train.samples}
                                customColumns={createLowConfidenceColumns()}
                                enableSearch={true}
                                searchPlaceholder="Search text..."
                              />
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          )
      )}
    </div>
  );
};
