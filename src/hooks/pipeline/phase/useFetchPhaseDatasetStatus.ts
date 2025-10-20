import { pipelineService } from "@/apis/pipeline"
import { useQuery } from "@tanstack/react-query"

export const PHASE_DATASET_STATUS_QUERY_KEY = "PhaseDatasetStatus"

export const useFetchPhaseDatasetStatus = (phaseId: string) => {
    return useQuery({
        queryKey: [PHASE_DATASET_STATUS_QUERY_KEY, phaseId],
        queryFn: () => pipelineService.getPhaseGenerationStatus(phaseId),
        refetchInterval: 10000, // Refetch every 4 seconds
    })
}
