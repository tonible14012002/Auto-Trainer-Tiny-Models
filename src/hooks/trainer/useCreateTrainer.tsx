import { useMutation } from "@tanstack/react-query";
import { trainerService } from "@/apis/trainer";

const CREATE_TRAINER_KEY = ["trainer", "create"];

export const useCreateTrainer = () => {
  return useMutation({
    mutationKey: CREATE_TRAINER_KEY,
    mutationFn: trainerService.createTrainer.bind(trainerService),
  });
};