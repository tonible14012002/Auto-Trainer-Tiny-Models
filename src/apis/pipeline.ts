import { AI_SERVICE_API_KEY } from "@/constants/envs";
import { Client } from "@/lib/client";
import fetcher from "@/lib/fetcher";
import { ResponseWithData } from "@/schema/response";
import {
    CreateTrainingProfileRequest,
    DeleteModelRequest,
    EvaluatePhaseRequest,
    FirstGenRequest,
    InferenceRequest,
    InferenceResponse,
    PhaseDetail,
    PhaseGenerationStatus,
    PipelineDetail,
    TestsetDetail,
    TrainModelEvaluation,
    TrainModelRequest,
    TrainingProfile,
    UpdateTrainingProfileRequest
} from "@/schema/schema_v2";

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
        return fetcher<ResponseWithData<TestsetDetail>>(
            `${this.baseUrl}/v2/workflow/pipelines/${pipelineId}/testset`,
            {
                headers: this.privateHeaders,
            }
        )
    }

    getPhase(phaseId: string) {
        return fetcher<ResponseWithData<PhaseDetail>>(
            `${this.baseUrl}/v2/workflow/phase/${phaseId}`,
            {
                headers: this.privateHeaders,
            }
        )
    }

    getPhaseTrainingPool(phaseId: string) {
        return fetcher<ResponseWithData<TestsetDetail>>(
            `${this.baseUrl}/v2/workflow/phase/${phaseId}/trainingpool`,
            {
                headers: this.privateHeaders,
            }
        )
    }

    getPhaseGenerationStatus(phaseId: string) {
        return fetcher<ResponseWithData<PhaseGenerationStatus>>(
            `${this.baseUrl}/v2/workflow/phase/${phaseId}/generation-status`,
            {
                headers: this.privateHeaders,
            }
        )
    }

    evaluatePhase(phaseId: string, input: EvaluatePhaseRequest) {
        return fetcher<ResponseWithData<TrainModelEvaluation>>(
            `${this.baseUrl}/v2/workflow/phase/${phaseId}/evaluate`,
            {
                method: "POST",
                headers: this.privateHeaders,
                body: JSON.stringify(input),
            }
        )
    }

    continueGeneration(phaseId: string) {
        return fetcher<ResponseWithData<any>>(
            `${this.baseUrlDataGen}/v2/workflow/phase/${phaseId}/continue-gen`,
            {
                method: "POST",
                headers: this.privateHeaders,
            }
        )
    }

    firstGen(request: FirstGenRequest) {
        return fetcher<ResponseWithData<any>>(
            `${this.baseUrlDataGen}/v2/workflow/phase/first-gen`,
            {
                method: "POST",
                headers: this.privateHeaders,
                body: JSON.stringify({
                    pipeline_id: request.pipeline_id,
                }),
            }
        )
    }

    trainModel(request: TrainModelRequest) {
        return fetcher<ResponseWithData<any>>(
            `${this.baseUrl}/v2/workflow/phase/${request.phase_id}/train`,
            {
                method: "POST",
                headers: this.privateHeaders,
                body: JSON.stringify({
                    ...(request.training_argument_profile_id && {
                        training_argument_profile_id: request.training_argument_profile_id
                    }),
                    ...(request.train_mode && {
                        train_mode: request.train_mode
                    }),
                }),
            }
        )
    }

    // Deprecated: Use trainModel with train_mode instead
    continualTrainModel(phaseId: string) {
        return fetcher<ResponseWithData<any>>(
            `${this.baseUrl}/v2/workflow/phase/${phaseId}/continual-train`,
            {
                method: "POST",
                headers: this.privateHeaders,
            }
        )
    }

    // Training Profile endpoints

    createTrainingProfile(input: CreateTrainingProfileRequest) {
        return fetcher<ResponseWithData<TrainingProfile>>(
            `${this.baseUrl}/v2/workflow/training-profile`,
            {
                method: "POST",
                headers: this.privateHeaders,
                body: JSON.stringify(input),
            }
        )
    }

    listTrainingProfiles() {
        return fetcher<ResponseWithData<TrainingProfile[]>>(
            `${this.baseUrl}/v2/workflow/training-profiles`,
            {
                headers: this.privateHeaders,
            }
        )
    }

    getTrainingProfile(profileId: string) {
        return fetcher<ResponseWithData<TrainingProfile>>(
            `${this.baseUrl}/v2/workflow/training-profile/${profileId}`,
            {
                headers: this.privateHeaders,
            }
        )
    }

    getTrainingProfileByName(profileName: string) {
        return fetcher<ResponseWithData<TrainingProfile>>(
            `${this.baseUrl}/v2/workflow/training-profile/name/${profileName}`,
            {
                headers: this.privateHeaders,
            }
        )
    }

    updateTrainingProfile(profileId: string, input: UpdateTrainingProfileRequest) {
        return fetcher<ResponseWithData<TrainingProfile>>(
            `${this.baseUrl}/v2/workflow/training-profile/${profileId}`,
            {
                method: "PUT",
                headers: this.privateHeaders,
                body: JSON.stringify(input),
            }
        )
    }

    deleteTrainingProfile(profileId: string) {
        return fetcher<ResponseWithData<{ message: string }>>(
            `${this.baseUrl}/v2/workflow/training-profile/${profileId}`,
            {
                method: "DELETE",
                headers: this.privateHeaders,
            }
        )
    }

    // Inference endpoint
    runInference(request: InferenceRequest) {
        return fetcher<InferenceResponse>(
            `${this.baseUrl}/v2/workflow/inference`,
            {
                method: "POST",
                headers: this.privateHeaders,
                body: JSON.stringify(request),
            }
        )
    }

    // Convert model to ONNX and download as zip
    async convertToOnnx(modelPath: string): Promise<Blob> {
        const response = await fetch(
            `${this.baseUrl}/v2/workflow/convert-to-onnx`,
            {
                method: "POST",
                headers: this.privateHeaders,
                body: JSON.stringify({ model_path: modelPath }),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to convert model: ${response.statusText}`);
        }

        return response.blob();
    }

    // Delete trained model
    deleteModel(request: DeleteModelRequest) {
        return fetcher<ResponseWithData<{ message: string }>>(
            `${this.baseUrl}/v2/workflow/delete-model`,
            {
                method: "POST",
                headers: this.privateHeaders,
                body: JSON.stringify(request),
            }
        )
    }
}

const pipelineService = new PipelineService();
pipelineService.setApiAuthToken(AI_SERVICE_API_KEY)

export { pipelineService };