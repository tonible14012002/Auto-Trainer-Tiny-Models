import { useMutation } from "@tanstack/react-query";
import { pipelineService } from "@/apis/pipeline";
import { useInvalidateTrainingProfiles } from "./useFetchTrainingProfiles";

const DELETE_TRAINING_PROFILE_KEY = ["training-profile", "delete"];

export const useDeleteTrainingProfile = () => {
  const invalidateTrainingProfiles = useInvalidateTrainingProfiles();

  return useMutation({
    mutationKey: DELETE_TRAINING_PROFILE_KEY,
    mutationFn: (profileId: string) =>
      pipelineService.deleteTrainingProfile(profileId),
    onSuccess: () => {
      // Invalidate the profiles list cache to refetch
      invalidateTrainingProfiles();
    },
  });
};
