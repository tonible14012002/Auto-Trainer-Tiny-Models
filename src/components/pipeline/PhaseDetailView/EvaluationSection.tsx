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
import React from "react";

dayjs.extend(relativeTime);

interface EvaluationSectionProps {
  trainedModels?: TrainedModelInfo[];
  labelConfig?: Record<string, string>;
}

const formatDate = (date: string) => {
  try {
    return dayjs(date).fromNow();
  } catch {
    return date;
  }
};

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
            <div className="max-w-xl text-sm break-words overflow-hidden cursor-default">
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
  console.log(trainedModels);

  return (
    <div className="space-y-6">
      {trainedModels?.map(
        (model) =>
          model.evaluation_results &&
          model.evaluation_results.length > 0 && (
            <div key={model.id} className="space-y-3">
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
                            <div className="border rounded-lg overflow-x-auto">
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
                                            <Badge variant="outline">
                                              {labelMetric.samples}
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    }
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}

                        {/* Low Confidence Samples */}
                        {recent_low_confidence_on_train?.samples?.length >
                          0 && (
                          <div className="space-y-3 mt-6">
                            <DatasetView<LowConfidentSample>
                              samples={recent_low_confidence_on_train.samples}
                              customColumns={createLowConfidenceColumns()}
                              enableSearch={true}
                              searchPlaceholder="Search text..."
                              headTitle={
                                <h5 className="font-medium text-sm text-amber-600 flex items-center gap-2">
                                  Low Confidence Predictions
                                  <Badge variant="outline">
                                    {recent_low_confidence_on_train.count}
                                  </Badge>
                                </h5>
                              }
                            />
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
