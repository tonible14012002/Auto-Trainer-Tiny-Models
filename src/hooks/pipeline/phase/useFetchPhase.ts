import { pipelineService } from "@/apis/pipeline"
import { useQuery } from "@tanstack/react-query"

export const PHASE_DETAIL_QUERY_KEY = "PhaseDetail"

export const useFetchPhase = (phaseId: string) => {
    return useQuery({
        queryKey: [PHASE_DETAIL_QUERY_KEY, phaseId],
        queryFn: () => pipelineService.getPhase(phaseId),
    })
}