
import { pipelineService } from "@/apis/pipeline"
import { useQuery } from "@tanstack/react-query"

export const PHASE_TRAINING_POOL_KEY = "phaseDetail-trainingpool"

export const useFetchTrainingPoolData = (phaseId: string) => {
    return useQuery({
        queryKey: [PHASE_TRAINING_POOL_KEY, phaseId],
        queryFn: () => pipelineService.getPhaseTrainingPool(phaseId),
    })
}
