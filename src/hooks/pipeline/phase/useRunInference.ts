import { useMutation } from "@tanstack/react-query";
import { pipelineService } from "@/apis/pipeline";
import { InferenceRequest } from "@/schema/schema_v2";

const RUN_INFERENCE_KEY = ["pipeline", "inference"];

export const useRunInference = () => {
  return useMutation({
    mutationKey: RUN_INFERENCE_KEY,
    mutationFn: (request: InferenceRequest) => pipelineService.runInference(request),
  });
};
