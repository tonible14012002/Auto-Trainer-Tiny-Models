import { useMutation } from "@tanstack/react-query";
import { pipelineService } from "@/apis/pipeline";
import { UpdateTrainingProfileRequest } from "@/schema/schema_v2";
import { useInvalidateTrainingProfile } from "./useFetchTrainingProfile";
import { useInvalidateTrainingProfiles } from "./useFetchTrainingProfiles";

const UPDATE_TRAINING_PROFILE_KEY = ["training-profile", "update"];

interface UpdateTrainingProfileParams {
  profileId: string;
  request: UpdateTrainingProfileRequest;
}

export const useUpdateTrainingProfile = () => {
  const invalidateTrainingProfile = useInvalidateTrainingProfile();
  const invalidateTrainingProfiles = useInvalidateTrainingProfiles();

  return useMutation({
    mutationKey: UPDATE_TRAINING_PROFILE_KEY,
    mutationFn: ({ profileId, request }: UpdateTrainingProfileParams) =>
      pipelineService.updateTrainingProfile(profileId, request),
    onSuccess: (_, variables) => {
      // Invalidate both the specific profile and the list
      invalidateTrainingProfile(variables.profileId);
      invalidateTrainingProfiles();
    },
  });
};
