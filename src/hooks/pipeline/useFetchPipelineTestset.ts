
import { pipelineService } from "@/apis/pipeline"
import { useQuery } from "@tanstack/react-query"

export const PIPELINE_TEST_SET_KEY = "pipelineDetail-testset"

export const useFetchPipelineTestSet = (pipelineId: string) => {
    return useQuery({
        queryKey: [PIPELINE_TEST_SET_KEY, pipelineId],
        queryFn: () => pipelineService.getPipelineTestSet(pipelineId),
    })
}