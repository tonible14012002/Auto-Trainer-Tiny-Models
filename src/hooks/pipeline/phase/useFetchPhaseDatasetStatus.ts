import { pipelineService } from "@/apis/pipeline";
import { useQuery } from "@tanstack/react-query";

export const PHASE_DATASET_STATUS_QUERY_KEY = "PhaseDatasetStatus";

interface UseFetchPhaseDatasetStatusParams {
  isDone?: boolean;
}

export const useFetchPhaseDatasetStatus = (
  phaseId: string,
  { isDone = false }
) => {
  return useQuery({
    queryKey: [PHASE_DATASET_STATUS_QUERY_KEY, phaseId],
    queryFn: () => pipelineService.getPhaseGenerationStatus(phaseId),
    refetchInterval: 10000, // Refetch every 4 seconds
    enabled: !isDone,
  });
};
