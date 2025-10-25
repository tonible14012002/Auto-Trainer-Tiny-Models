import { useMutation } from "@tanstack/react-query";
import { pipelineService } from "@/apis/pipeline";
import { DeleteModelRequest } from "@/schema/schema_v2";

const DELETE_MODEL_KEY = ["pipeline", "delete-model"];

export const useDeleteModel = () => {
  return useMutation({
    mutationKey: DELETE_MODEL_KEY,
    mutationFn: (request: DeleteModelRequest) => pipelineService.deleteModel(request),
  });
};
