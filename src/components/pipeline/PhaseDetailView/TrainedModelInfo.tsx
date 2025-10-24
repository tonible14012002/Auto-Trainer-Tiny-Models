"use client";

import { useState } from "react";
import { TrainedModelInfo as TrainedModelInfoType } from "@/schema/schema_v2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Settings2, ChevronDown, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { InferenceDialog } from "./InferenceDialog";

dayjs.extend(relativeTime);

interface TrainedModelInfoProps {
  model: TrainedModelInfoType;
  pipelineId: string;
  onEvaluate: (trainedModelId: string) => void;
  isEvaluating: boolean;
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
}: TrainedModelInfoProps) => {
  const [showTrainingParams, setShowTrainingParams] = useState(false);
  const hasEvaluation = model.evaluation_results && model.evaluation_results.length > 0;
  const hasTrainingProfile = !!model.training_argument_profile;
  const hasTrainingParams = !!model.training_params;

  return (
    <div className="space-y-4">
      {/* Model Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{model.model_name}</h3>
          <Badge variant="outline" className="text-xs">
            {model.model_type === "FROM_SCRATCH" ? "From Scratch" : "Continual"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(model.status)}
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
            >
              {isEvaluating ? "Evaluating..." : "Evaluate"}
            </Button>
          )}
        </div>
      </div>

      {/* Model Metadata */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="w-3 h-3" />
        Created {formatDate(model.created_at)}
      </div>

      {/* Model Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">Model Path:</span>
          <code className="block text-xs bg-muted px-2 py-1 rounded mt-1 truncate">
            {model.model_save_path}
          </code>
        </div>
        {model.training_time && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Training Time:</span>
            <span>{model.training_time}s</span>
          </div>
        )}
      </div>

      {/* Training Profile Section */}
      {hasTrainingProfile && (
        <div className="space-y-2">
          <h5 className="font-medium text-sm flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Training Profile
          </h5>
          <div className="bg-accent/50 rounded-lg p-3 space-y-2">
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
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                LR: {model.training_argument_profile!.training_config.learning_rate}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Epochs: {model.training_argument_profile!.training_config.num_train_epochs}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Batch Size: {model.training_argument_profile!.training_config.per_device_train_batch_size}
              </Badge>
              <Badge variant="outline" className="text-xs">
                LoRA r: {model.training_argument_profile!.lora_config.r}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Training Parameters Toggle */}
      {hasTrainingParams && (
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTrainingParams(!showTrainingParams)}
            className="h-auto p-0 justify-start text-sm font-medium"
          >
            {showTrainingParams ? (
              <ChevronDown className="w-4 h-4 mr-1" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1" />
            )}
            Training Parameters
            {!hasTrainingProfile && (
              <Badge variant="outline" className="text-xs ml-2">
                Default
              </Badge>
            )}
          </Button>
          
          {showTrainingParams && (
            <div className="bg-muted rounded p-3 text-xs overflow-x-auto">
              <pre>{JSON.stringify(model.training_params, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
