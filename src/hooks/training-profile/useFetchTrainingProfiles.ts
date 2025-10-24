import { pipelineService } from "@/apis/pipeline";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const TRAINING_PROFILES_QUERY_KEY = "TrainingProfiles";

interface Options {
  ignoreRefetch?: boolean;
}

export const useFetchTrainingProfiles = (options: Options = {}) => {
  return useQuery({
    queryKey: [TRAINING_PROFILES_QUERY_KEY],
    queryFn: () => pipelineService.listTrainingProfiles(),
    ...(options
      ? {
          enabled: !options.ignoreRefetch,
        }
      : null),
  });
};

export const useInvalidateTrainingProfiles = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: [TRAINING_PROFILES_QUERY_KEY],
    });
  };
};
