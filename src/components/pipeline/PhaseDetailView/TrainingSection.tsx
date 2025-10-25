"use client";

import { useState } from "react";
import { TrainedModelInfo as TrainedModelInfoType, TrainModelRequest } from "@/schema/schema_v2";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Play } from "lucide-react";
import { useEvaluatePhase } from "@/hooks/pipeline/phase/useEvaluatePhase";
import { useTrainModel } from "@/hooks/pipeline/phase/useTrainModel";
import { useInvalidatePhase } from "@/hooks/pipeline/phase/useFetchPhase";
import { StartTrainForm } from "@/components/training-profile";
import { TrainedModelInfo } from "./TrainedModelInfo";

interface TrainingSectionProps {
  phaseId: string;
  pipelineId: string;
  trainedModels?: TrainedModelInfoType[];
  previousPhaseId?: string;
  refetchPhase: () => void;
}

export const TrainingSection = ({
  phaseId,
  pipelineId,
  trainedModels,
  previousPhaseId,
  refetchPhase,
}: TrainingSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: evaluatePhase, isPending } = useEvaluatePhase();
  const invalidatePhase = useInvalidatePhase();

  const { mutate: trainModel, isPending: isTraining, error } = useTrainModel();

  const handleEvaluate = (trainedModelId: string) => {
    evaluatePhase({
      phaseId,
      request: {
        trained_model_id: trainedModelId,
        confidence_thresholds: 0.5,
      },
    });
  };

  const handleStartTraining = (request: TrainModelRequest) => {
    trainModel(request, {
      onSuccess: () => {
        invalidatePhase(phaseId);
        setIsDialogOpen(false);
      },
    });
  };

  if (!trainedModels || trainedModels.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4 text-muted-foreground text-sm">
          No trained models available
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <Play className="w-4 h-4" />
                Start Training
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configure Model Training</DialogTitle>
                <DialogDescription>
                  Select training mode and configuration profile to start training
                </DialogDescription>
              </DialogHeader>
              <StartTrainForm
                phaseId={phaseId}
                onSubmit={handleStartTraining}
                onCancel={() => setIsDialogOpen(false)}
                isLoading={isTraining}
                error={error?.message}
                previousPhaseId={previousPhaseId}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trainedModels.map((model) => (
        <Card key={model.id} className="p-4 gap-0 rounded-sm shadow-none">
          <CardContent className="px-0">
            <TrainedModelInfo
              model={model}
              pipelineId={pipelineId}
              onEvaluate={handleEvaluate}
              isEvaluating={isPending}
              onDelete={refetchPhase}
            />
          </CardContent>
        </Card>
      ))}

      {/* Show training button to add more models */}
      <div className="flex flex-wrap gap-2 justify-center pt-4 border-t">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Play className="w-4 h-4" />
              Train New Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configure Model Training</DialogTitle>
              <DialogDescription>
                Select training mode and configuration profile to start training
              </DialogDescription>
            </DialogHeader>
            <StartTrainForm
              phaseId={phaseId}
              onSubmit={handleStartTraining}
              onCancel={() => setIsDialogOpen(false)}
              isLoading={isTraining}
              error={error?.message}
              previousPhaseId={previousPhaseId}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
