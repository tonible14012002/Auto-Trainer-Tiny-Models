import { pipelineService } from "@/apis/pipeline"
import { useQuery } from "@tanstack/react-query"

export const PIPELINE_QUERY_KEY = "pipelines"

export const useFetchPipelines = () => {
    return useQuery({
        queryKey: [PIPELINE_QUERY_KEY],
        queryFn: () => pipelineService.listPipelines()
    })
}