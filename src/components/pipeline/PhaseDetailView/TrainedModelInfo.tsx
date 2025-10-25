"use client";

import { useState } from "react";
import { TrainedModelInfo as TrainedModelInfoType, LabelEvaluation } from "@/schema/schema_v2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar, Clock, Settings2, Info, TrendingUp, Download, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { InferenceDialog } from "./InferenceDialog";
import { useConvertToOnnx } from "@/hooks/pipeline/phase/useConvertToOnnx";
import { useDeleteModel } from "@/hooks/pipeline/phase/useDeleteModel";
import { toast } from "sonner";

dayjs.extend(relativeTime);

interface TrainedModelInfoProps {
  model: TrainedModelInfoType;
  pipelineId: string;
  onEvaluate: (trainedModelId: string) => void;
  isEvaluating: boolean;
  onDelete: () => void;
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
    DONE: "default",
  };
  return (
    <Badge
      variant={variants[status] || "outline"}
      className="bg-green-50 text-green-700 border-green-200 capitalize"
    >
      {status.toLowerCase()}
    </Badge>
  );
};

export const TrainedModelInfo = ({
  model,
  pipelineId,
  onEvaluate,
  isEvaluating,
  onDelete,
}: TrainedModelInfoProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const hasEvaluation = model.evaluation_results && model.evaluation_results.length > 0;
  const hasTrainingProfile = !!model.training_argument_profile;
  const hasTrainingParams = !!model.training_params;

  const { mutate: convertToOnnx, isPending: isConverting } = useConvertToOnnx();
  const { mutate: deleteModel, isPending: isDeleting } = useDeleteModel();

  const handleDownloadOnnx = () => {
    convertToOnnx(model.model_save_path, {
      onSuccess: () => {
        toast.success("ONNX model downloaded successfully");
      },
      onError: (error) => {
        toast.error(`Failed to download ONNX model: ${error.message}`);
      },
    });
  };

  const handleDelete = () => {
    deleteModel(
      { model_id: model.id },
      {
        onSuccess: () => {
          toast.success("Model deleted successfully");
          setIsDeleteDialogOpen(false);
          onDelete();
        },
        onError: (error) => {
          toast.error(`Failed to delete model: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      {/* Left: Minimal Key Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium truncate">{model.model_name}</h3>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {model.model_type === "FROM_SCRATCH" ? "From Scratch" : "Continual"}
            </Badge>
            {getStatusBadge(model.status)}
          </div>

          {/* Crucial Training Profile Info - Key Differences */}
          {hasTrainingProfile && (
            <div className="flex flex-wrap gap-1.5 text-xs">
              <Badge variant="secondary" className="text-xs font-normal">
                {model.training_argument_profile!.name}
              </Badge>
              <Badge variant="outline" className="text-xs font-mono">
                LR: {model.training_argument_profile!.training_config.learning_rate}
              </Badge>
              <Badge variant="outline" className="text-xs font-mono">
                Epochs: {model.training_argument_profile!.training_config.num_train_epochs}
              </Badge>
              <Badge variant="outline" className="text-xs font-mono">
                r: {model.training_argument_profile!.lora_config.r}
              </Badge>
            </div>
          )}

          {/* Evaluation Metrics */}
          {hasEvaluation && model.evaluation_results[0] && (
            <div className="flex items-center gap-1.5 text-xs">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="cursor-help bg-blue-50 border-blue-200 text-blue-700 font-mono">
                    Acc: {(model.evaluation_results[0].accuracy * 100).toFixed(1)}%
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Overall Accuracy</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="cursor-help bg-purple-50 border-purple-200 text-purple-700 font-mono">
                    F1: {(model.evaluation_results[0].f1_score * 100).toFixed(1)}%
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">F1 Score</p>
                </TooltipContent>
              </Tooltip>

              {/* Per-Label Metrics in Tooltip */}
              {model.evaluation_results[0].label_metrics && (() => {
                const { recent_low_confidence_on_train, ...labelMetrics } = model.evaluation_results[0].label_metrics;
                const labelCount = Object.keys(labelMetrics).length;

                if (labelCount > 0) {
                  return (
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="cursor-help bg-green-50 border-green-200 text-green-700">
                          {labelCount} Labels
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-2">
                          <div className="text-xs font-semibold border-b pb-1">Per-Label Metrics</div>
                          <div className="space-y-1.5 max-h-60 overflow-y-auto">
                            {Object.entries(labelMetrics).map(([labelId, metrics]) => {
                              const labelMetric = metrics as LabelEvaluation;
                              return (
                                <div key={labelId} className="text-xs space-y-0.5 pb-1.5 border-b last:border-0">
                                  <div className="font-medium">{labelId}</div>
                                  <div className="grid grid-cols-2 gap-x-2 text-[10px] text-muted-foreground">
                                    <span>Acc: {(labelMetric.accuracy * 100).toFixed(1)}%</span>
                                    <span>F1: {(labelMetric.f1_score * 100).toFixed(1)}%</span>
                                    <span>Prec: {(labelMetric.precision * 100).toFixed(1)}%</span>
                                    <span>Rec: {(labelMetric.recall * 100).toFixed(1)}%</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                }
                return null;
              })()}
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDate(model.created_at)}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:flex-shrink-0">
        {/* Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 px-2">
              <Info className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{model.model_name}</DialogTitle>
              <DialogDescription>
                Detailed training information and parameters
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Status & Type */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {model.model_type === "FROM_SCRATCH" ? "From Scratch" : "Continual"}
                </Badge>
                {getStatusBadge(model.status)}
              </div>

              {/* Model Metadata */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Model Information</h4>
                <div className="bg-muted rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span className="text-muted-foreground">Created:</span>
                    <span>{formatDate(model.created_at)}</span>
                  </div>
                  {model.training_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span className="text-muted-foreground">Training Time:</span>
                      <span>{model.training_time}s</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Model Path:</span>
                    <code className="block text-xs bg-background px-2 py-1 rounded mt-1 break-all">
                      {model.model_save_path}
                    </code>
                  </div>
                </div>
              </div>

              {/* Training Profile Section */}
              {hasTrainingProfile && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    Training Profile
                  </h4>
                  <div className="bg-accent/50 rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {model.training_argument_profile!.name}
                      </span>
                      {model.training_argument_profile!.description && (
                        <Badge variant="secondary" className="text-xs">
                          Custom
                        </Badge>
                      )}
                    </div>
                    {model.training_argument_profile!.description && (
                      <p className="text-xs text-muted-foreground">
                        {model.training_argument_profile!.description}
                      </p>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h5 className="text-xs font-medium mb-2">Training Config</h5>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-xs">
                            <span className="text-muted-foreground">Learning Rate:</span>
                            <span className="ml-2 font-mono">{model.training_argument_profile!.training_config.learning_rate}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Epochs:</span>
                            <span className="ml-2 font-mono">{model.training_argument_profile!.training_config.num_train_epochs}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Batch Size:</span>
                            <span className="ml-2 font-mono">{model.training_argument_profile!.training_config.per_device_train_batch_size}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Gradient Accum:</span>
                            <span className="ml-2 font-mono">{model.training_argument_profile!.training_config.gradient_accumulation_steps}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-xs font-medium mb-2">LoRA Config</h5>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-xs">
                            <span className="text-muted-foreground">r (rank):</span>
                            <span className="ml-2 font-mono">{model.training_argument_profile!.lora_config.r}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">alpha:</span>
                            <span className="ml-2 font-mono">{model.training_argument_profile!.lora_config.lora_alpha}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">dropout:</span>
                            <span className="ml-2 font-mono">{model.training_argument_profile!.lora_config.lora_dropout}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Training Parameters */}
              {hasTrainingParams && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    Training Parameters
                    {!hasTrainingProfile && (
                      <Badge variant="outline" className="text-xs ml-2">
                        Default
                      </Badge>
                    )}
                  </h4>
                  <div className="bg-muted rounded-lg p-3 text-xs overflow-x-auto">
                    <pre>{JSON.stringify(model.training_params, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Download ONNX Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadOnnx}
              disabled={isConverting}
              className="h-8 px-2 sm:px-3"
            >
              {isConverting ? (
                <>
                  <Clock className="w-3.5 h-3.5 sm:mr-1.5 animate-spin" />
                  <span className="hidden sm:inline">Converting...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 sm:mr-1.5" />
                  <span className="hidden sm:inline">ONNX</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Download model as ONNX format</p>
          </TooltipContent>
        </Tooltip>

        <InferenceDialog
          modelPath={model.model_save_path}
          pipelineId={pipelineId}
          modelName={model.model_name}
        />

        {!hasEvaluation && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEvaluate(model.id)}
            disabled={isEvaluating}
            className="h-8 px-2 sm:px-3"
          >
            <span className="text-xs">{isEvaluating ? "Evaluating..." : "Evaluate"}</span>
          </Button>
        )}

        {/* Delete Button with Confirmation */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Delete model</p>
          </TooltipContent>
        </Tooltip>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Model</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this model? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="bg-muted rounded-lg p-3 text-sm">
                <div className="font-medium">{model.model_name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  ID: {model.id}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Model"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
