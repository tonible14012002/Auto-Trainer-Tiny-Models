import { useMutation } from "@tanstack/react-query";
import { pipelineService } from "@/apis/pipeline";

const CONTINUE_GENERATION_KEY = ["phase", "continue-generation"];

interface ContinueGenerationParams {
  phaseId: string;
}

export const useContinueGeneration = () => {
  return useMutation({
    mutationKey: CONTINUE_GENERATION_KEY,
    mutationFn: ({ phaseId }: ContinueGenerationParams) => {
      return pipelineService.continueGeneration(phaseId);
    }
  });
};
