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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Info } from "lucide-react";

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
    <div className="space-y-4">
      {trainedModels?.map(
        (model) =>
          model.evaluation_results &&
          model.evaluation_results.length > 0 && (
            <div key={model.id} className="border rounded-lg p-4">
              {model.evaluation_results.map((evaluation) => {
                // Extract recent_low_confidence_on_train and label metrics
                const { recent_low_confidence_on_train, ...labelMetrics } =
                  evaluation.label_metrics || {};

                return (
                  <div key={evaluation.id} className="space-y-3">
                    {/* Minimal Model Header with Training Profile */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium break-words">{model.model_name}</span>
                        {model.training_argument_profile && (
                          <Badge variant="secondary" className="text-xs">
                            {model.training_argument_profile.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Compact Overall Metrics */}
                    <div className="flex flex-wrap gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="cursor-help">
                            Acc: {(evaluation.accuracy * 100).toFixed(1)}%
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Accuracy</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="cursor-help">
                            Prec: {(evaluation.precision * 100).toFixed(1)}%
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Precision</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="cursor-help">
                            Rec: {(evaluation.recall * 100).toFixed(1)}%
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Recall</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="cursor-help">
                            F1: {(evaluation.f1_score * 100).toFixed(1)}%
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">F1 Score</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Details Dialog */}
                      {Object.keys(labelMetrics).length > 0 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-6 px-2 ml-auto">
                              <Info className="w-3.5 h-3.5 mr-1" />
                              <span className="text-xs">Details</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Evaluation Details: {model.model_name}</DialogTitle>
                              <DialogDescription>
                                Per-label metrics and confusion matrix
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              {/* Overall Metrics - Full View */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border">
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Accuracy
                                  </div>
                                  <div className="text-xl font-bold text-blue-600">
                                    {(evaluation.accuracy * 100).toFixed(1)}%
                                  </div>
                                </div>
                                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border">
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Precision
                                  </div>
                                  <div className="text-xl font-bold text-green-600">
                                    {(evaluation.precision * 100).toFixed(1)}%
                                  </div>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg border">
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Recall
                                  </div>
                                  <div className="text-xl font-bold text-orange-600">
                                    {(evaluation.recall * 100).toFixed(1)}%
                                  </div>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg border">
                                  <div className="text-xs text-muted-foreground mb-1">
                                    F1 Score
                                  </div>
                                  <div className="text-xl font-bold text-purple-600">
                                    {(evaluation.f1_score * 100).toFixed(1)}%
                                  </div>
                                </div>
                              </div>

                              {/* Per-Label Metrics Table */}
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">Per-Label Metrics</h4>
                                <div className="border rounded-lg overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="font-medium">Label</TableHead>
                                        <TableHead className="font-medium">Accuracy</TableHead>
                                        <TableHead className="font-medium">Precision</TableHead>
                                        <TableHead className="font-medium">Recall</TableHead>
                                        <TableHead className="font-medium">F1 Score</TableHead>
                                        <TableHead className="font-medium">Samples</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {Object.entries(labelMetrics).map(([labelId, metrics]) => {
                                        const labelMetric = metrics as LabelEvaluation;
                                        return (
                                          <TableRow key={labelId}>
                                            <TableCell className="font-medium">
                                              <Badge variant="outline">
                                                {labelConfig?.[labelId] || `${labelId}`}
                                              </Badge>
                                            </TableCell>
                                            <TableCell>
                                              {(labelMetric.accuracy * 100).toFixed(1)}%
                                            </TableCell>
                                            <TableCell>
                                              {(labelMetric.precision * 100).toFixed(1)}%
                                            </TableCell>
                                            <TableCell>
                                              {(labelMetric.recall * 100).toFixed(1)}%
                                            </TableCell>
                                            <TableCell>
                                              {(labelMetric.f1_score * 100).toFixed(1)}%
                                            </TableCell>
                                            <TableCell>
                                              <Tooltip delayDuration={300}>
                                                <TooltipTrigger asChild>
                                                  <Badge variant="outline" className="cursor-help">
                                                    {labelMetric.samples}
                                                  </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <div className="text-xs space-y-1">
                                                    <div className="font-semibold mb-1">
                                                      Confusion Matrix:
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                                                      <span className="text-green-600">
                                                        True Positives:
                                                      </span>
                                                      <span className="font-mono">
                                                        {labelMetric.true_positives}
                                                      </span>
                                                      <span className="text-red-600">
                                                        False Positives:
                                                      </span>
                                                      <span className="font-mono">
                                                        {labelMetric.false_positives}
                                                      </span>
                                                      <span className="text-green-600">
                                                        True Negatives:
                                                      </span>
                                                      <span className="font-mono">
                                                        {labelMetric.true_negatives}
                                                      </span>
                                                      <span className="text-red-600">
                                                        False Negatives:
                                                      </span>
                                                      <span className="font-mono">
                                                        {labelMetric.false_negatives}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>

                    {/* Low Confidence Samples - Collapsible */}
                    {recent_low_confidence_on_train?.samples?.length > 0 && (
                      <div className="space-y-2 pt-2 border-t">
                        <button
                          onClick={() => setShowLowConfidence(!showLowConfidence)}
                          className="flex items-center gap-2 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                        >
                          {showLowConfidence ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                          Low Confidence Predictions
                          <Badge variant="outline" className="text-xs">
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
                  </div>
                );
              })}
            </div>
          )
      )}
    </div>
  );
};
