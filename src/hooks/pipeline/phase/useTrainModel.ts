import { useMutation } from "@tanstack/react-query";
import { pipelineService } from "@/apis/pipeline";
import { TrainModelRequest } from "@/schema/schema_v2";

const TRAIN_MODEL_KEY = ["phase", "train"];

export const useTrainModel = () => {
  return useMutation({
    mutationKey: TRAIN_MODEL_KEY,
    mutationFn: (request: TrainModelRequest) => pipelineService.trainModel(request),
  });
};
