"use client";

import { useState } from "react";
import { TrainingArgumentProfileSelector } from "./TrainingArgumentProfileSelector";
import { TrainModelSelector } from "./TrainModelSelector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Play, Settings2, AlertCircle, Loader2 } from "lucide-react";
import { TrainModelRequest } from "@/schema/schema_v2";

interface StartTrainFormProps {
  phaseId: string;
  onSubmit: (request: TrainModelRequest) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
  previousPhaseId?: string;
}

export function StartTrainForm({
  phaseId,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
  previousPhaseId,
}: StartTrainFormProps) {
  const [trainingProfileId, setTrainingProfileId] = useState<
    string | undefined
  >();
  const [previousModelId, setPreviousModelId] = useState<string | undefined>();
  const [trainMode, setTrainMode] = useState<"FROM_SCRATCH" | "CONTINUAL">(
    "FROM_SCRATCH"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request: TrainModelRequest = {
      phase_id: phaseId,
      train_mode: trainMode,
      ...(trainingProfileId && {
        training_argument_profile_id: trainingProfileId,
      }),
      ...(trainMode === "CONTINUAL" && previousModelId && {
        previous_trained_model_id: previousModelId,
      }),
    };

    onSubmit(request);
  };

  const isFormValid = trainMode !== undefined && 
    (trainMode === "FROM_SCRATCH" || (trainMode === "CONTINUAL" && previousModelId));

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Training Mode Selector */}
        <div className="space-y-2">
          <Label htmlFor="train-mode" className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Training Mode
            <span className="text-destructive">*</span>
          </Label>
          <Select
            value={trainMode}
            onValueChange={(value: "FROM_SCRATCH" | "CONTINUAL") =>
              setTrainMode(value)
            }
            disabled={isLoading}
          >
            <SelectTrigger id="train-mode">
              {trainMode === "FROM_SCRATCH" ? "From Scratch": "Continual"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FROM_SCRATCH">
                <div className="space-y-1">
                  <div className="font-medium">From Scratch</div>
                  <div className="text-xs text-muted-foreground">
                    Train a new model from the base checkpoint
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="CONTINUAL">
                <div className="space-y-1">
                  <div className="font-medium">Continual Training</div>
                  <div className="text-xs text-muted-foreground">
                    Continue training from a previous checkpoint
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {trainMode === "FROM_SCRATCH"
              ? "This will start training from the base model checkpoint"
              : "This will continue training from the previous phase's model"}
          </p>
        </div>

        {/* Previous Model Selector - Only show for CONTINUAL mode */}
        {trainMode === "CONTINUAL" && (
          <div className="space-y-2">
            <Label htmlFor="previous-model" className="flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Previous Model
              <span className="text-destructive">*</span>
            </Label>
            <TrainModelSelector
              value={previousModelId}
              onValueChange={setPreviousModelId}
              placeholder="Select a model from previous phase"
              disabled={isLoading}
              previousPhaseId={previousPhaseId}
            />
            <p className="text-xs text-muted-foreground">
              {previousModelId
                ? "Training will continue from the selected model"
                : "Please select a model from the previous phase to continue training"}
            </p>
          </div>
        )}

        {/* Training Profile Selector */}
        <div className="space-y-2">
          <Label htmlFor="training-profile" className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Training Profile
            <span className="text-muted-foreground text-xs font-normal">
              (Optional)
            </span>
          </Label>
          <TrainingArgumentProfileSelector
            value={trainingProfileId}
            onValueChange={setTrainingProfileId}
            placeholder="Use default training configuration"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            {trainingProfileId
              ? "Custom training configuration will be used"
              : "Default training configuration will be applied if not specified"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!isFormValid || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Starting Training...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Training
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
