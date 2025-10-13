import { pipelineService } from "@/apis/pipeline"
import { useQuery } from "@tanstack/react-query"

export const PIPELINE_DETAIL_QUERY_KEY = "pipelineDetail"

export const useFetchPipeline = (pipelineId: string) => {
    return useQuery({
        queryKey: [PIPELINE_DETAIL_QUERY_KEY, pipelineId],
        queryFn: () => pipelineService.getPipeline(pipelineId),
    })
}