import { useQuery } from "@tanstack/react-query";
import { trainerService } from "@/apis/trainer";

const FETCH_TRAINER_DETAIL_KEY = ["trainer", "detail"];

export const useFetchTrainerDetail = (trainerId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...FETCH_TRAINER_DETAIL_KEY, trainerId],
    queryFn: () => trainerService.getTrainerDetail(trainerId),
    enabled: enabled && !!trainerId,
  });
};
