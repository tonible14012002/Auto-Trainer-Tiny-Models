import { useMutation } from "@tanstack/react-query";
import { pipelineService } from "@/apis/pipeline";
import { EvaluatePhaseRequest } from "@/schema/schema_v2";
import { useInvalidatePhase } from "./useFetchPhase";

const EVALUATE_PHASE_KEY = ["phase", "evaluate"];

interface EvaluatePhaseParams {
  phaseId: string;
  request: EvaluatePhaseRequest;
}

export const useEvaluatePhase = () => {
  const invalidatePhase = useInvalidatePhase();

  return useMutation({
    mutationKey: EVALUATE_PHASE_KEY,
    mutationFn: ({ phaseId, request }: EvaluatePhaseParams) =>
      pipelineService.evaluatePhase(phaseId, request),
    onSuccess: (_, variables) => {
      // Invalidate the phase detail cache to refetch the evaluation results
      invalidatePhase(variables.phaseId);
    },
  });
};
