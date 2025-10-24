import { pipelineService } from "@/apis/pipeline";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const TRAINING_PROFILE_QUERY_KEY = "TrainingProfile";
export const TRAINING_PROFILE_BY_NAME_QUERY_KEY = "TrainingProfileByName";

interface Options {
  ignoreRefetch?: boolean;
}

export const useFetchTrainingProfile = (
  profileId: string,
  options: Options = {}
) => {
  return useQuery({
    queryKey: [TRAINING_PROFILE_QUERY_KEY, profileId],
    queryFn: () => pipelineService.getTrainingProfile(profileId),
    ...(options
      ? {
          enabled: !options.ignoreRefetch,
        }
      : null),
  });
};

export const useFetchTrainingProfileByName = (
  profileName: string,
  options: Options = {}
) => {
  return useQuery({
    queryKey: [TRAINING_PROFILE_BY_NAME_QUERY_KEY, profileName],
    queryFn: () => pipelineService.getTrainingProfileByName(profileName),
    ...(options
      ? {
          enabled: !options.ignoreRefetch,
        }
      : null),
  });
};

export const useInvalidateTrainingProfile = () => {
  const queryClient = useQueryClient();

  return (profileId: string) => {
    queryClient.invalidateQueries({
      queryKey: [TRAINING_PROFILE_QUERY_KEY, profileId],
    });
  };
};

export const useInvalidateTrainingProfileByName = () => {
  const queryClient = useQueryClient();

  return (profileName: string) => {
    queryClient.invalidateQueries({
      queryKey: [TRAINING_PROFILE_BY_NAME_QUERY_KEY, profileName],
    });
  };
};
