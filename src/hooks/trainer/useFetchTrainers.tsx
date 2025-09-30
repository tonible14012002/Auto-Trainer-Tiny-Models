import { useQuery, useQueryClient } from "@tanstack/react-query";
import { trainerService } from "@/apis/trainer";
import { useCallback } from "react";
import { ListTrainerQuery } from "@/apis/trainer";

const FETCH_TRAINERS_KEY = "trainers";

export const useFetchTrainers = (params?: ListTrainerQuery) => {
  return useQuery({
    queryKey: [FETCH_TRAINERS_KEY, params],
    queryFn: () => trainerService.getTrainers(params),
  });
};

export const useInvalidateTrainers = () => {
  const queryClient = useQueryClient();
  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [FETCH_TRAINERS_KEY],
    });
  }, [queryClient]);

  return invalidate;
};