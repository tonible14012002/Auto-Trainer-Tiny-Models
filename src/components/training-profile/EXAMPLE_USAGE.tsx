/**
 * Example Usage of StartTrainForm and TrainingArgumentProfileSelector
 *
 * This file demonstrates how to use the new training components in your application.
 */

import { StartTrainForm } from "@/components/training-profile";
import { useTrainModel } from "@/hooks/pipeline/phase/useTrainModel";
import { TrainModelRequest } from "@/schema/schema_v2";

// Example 1: Using StartTrainForm in a page or component
export function TrainingPage({ phaseId }: { phaseId: string }) {
  const { mutate: trainModel, isPending, error } = useTrainModel();

  const handleStartTraining = (request: TrainModelRequest) => {
    trainModel(request, {
      onSuccess: () => {
        console.log("Training started successfully!");
        // Handle success (e.g., show notification, navigate, etc.)
      },
      onError: (error) => {
        console.error("Failed to start training:", error);
        // Handle error
      },
    });
  };

  return (
    <div className="container mx-auto p-6">
      <StartTrainForm
        phaseId={phaseId}
        onSubmit={handleStartTraining}
        isLoading={isPending}
        error={error?.message}
      />
    </div>
  );
}

// Example 2: Using StartTrainForm in a Dialog
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function TrainModelDialog({ phaseId }: { phaseId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate: trainModel, isPending, error } = useTrainModel();

  const handleStartTraining = (request: TrainModelRequest) => {
    trainModel(request, {
      onSuccess: () => {
        setOpen(false);
        // Show success notification
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Start Training</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Training</DialogTitle>
        </DialogHeader>
        <StartTrainForm
          phaseId={phaseId}
          onSubmit={handleStartTraining}
          onCancel={() => setOpen(false)}
          isLoading={isPending}
          error={error?.message}
        />
      </DialogContent>
    </Dialog>
  );
}

// Example 3: Using TrainingArgumentProfileSelector standalone
import { TrainingArgumentProfileSelector } from "@/components/training-profile";

export function CustomTrainingForm({ phaseId }: { phaseId: string }) {
  const [profileId, setProfileId] = useState<string | undefined>();

  const handleSubmit = () => {
    const request: TrainModelRequest = {
      phase_id: phaseId,
      train_mode: "FROM_SCRATCH",
      ...(profileId && { training_argument_profile_id: profileId }),
    };

    // Submit the request
    console.log("Training request:", request);
  };

  return (
    <div className="space-y-4">
      <TrainingArgumentProfileSelector
        value={profileId}
        onValueChange={setProfileId}
        placeholder="Select a training profile..."
      />

      {/* Your custom form fields */}

      <Button onClick={handleSubmit}>Start Training</Button>
    </div>
  );
}
