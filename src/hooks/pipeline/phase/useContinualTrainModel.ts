import { useMutation } from "@tanstack/react-query";
import { pipelineService } from "@/apis/pipeline";
import { useInvalidatePhase } from "./useFetchPhase";

const CONTINUAL_TRAIN_MODEL_KEY = ["phase", "continual-train"];

export const useContinualTrainModel = () => {
  const invalidatePhase = useInvalidatePhase();

  return useMutation({
    mutationKey: CONTINUAL_TRAIN_MODEL_KEY,
    mutationFn: (phaseId: string) => pipelineService.continualTrainModel(phaseId),
    onSuccess: (_, phaseId) => {
      // Invalidate the phase detail cache to refetch the trained models
      invalidatePhase(phaseId);
    },
  });
};
