import { useMutation } from "@tanstack/react-query";
import { pipelineService } from "@/apis/pipeline";
import { CreateTrainingProfileRequest } from "@/schema/schema_v2";
import { useInvalidateTrainingProfiles } from "./useFetchTrainingProfiles";

const CREATE_TRAINING_PROFILE_KEY = ["training-profile", "create"];

export const useCreateTrainingProfile = () => {
  const invalidateTrainingProfiles = useInvalidateTrainingProfiles();

  return useMutation({
    mutationKey: CREATE_TRAINING_PROFILE_KEY,
    mutationFn: (request: CreateTrainingProfileRequest) =>
      pipelineService.createTrainingProfile(request),
    onSuccess: () => {
      // Invalidate the profiles list cache to refetch
      invalidateTrainingProfiles();
    },
  });
};
