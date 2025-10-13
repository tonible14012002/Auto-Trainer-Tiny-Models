import { AI_SERVICE_API_KEY } from "@/constants/envs";
import { Client } from "@/lib/client";
import fetcher from "@/lib/fetcher";
import { ResponseWithData } from "@/schema/response";
import { PipelineDetail } from "@/schema/schema_v2";

class PipelineService extends Client {
    listPipelines() {
        return fetcher<ResponseWithData<PipelineDetail[]>>(
            `${this.baseUrl}/v2/workflow/pipelines`,
            {
                headers: this.privateHeaders,
            }
        )
    }
    getPipeline(pipelineId: string) {
        return fetcher<ResponseWithData<PipelineDetail>>(
            `${this.baseUrl}/v2/workflow/pipelines/${pipelineId}`,
            {
                headers: this.privateHeaders,
            }
        )
    }

    getPipelineTestSet(pipelineId: string) {
        return fetcher<ResponseWithData>(
            `${this.baseUrl}/v2/workflow/pipelines/${pipelineId}/testset`,
            {
                headers: this.privateHeaders,
            }
        )
    }
}

const pipelineService = new PipelineService();
pipelineService.setApiAuthToken(AI_SERVICE_API_KEY)

export { pipelineService };