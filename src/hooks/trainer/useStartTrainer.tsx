import { useMutation } from "@tanstack/react-query";
import { trainerService } from "@/apis/trainer";

const START_TRAINER_KEY = ["trainer", "start"];

export const useStartTrainer = () => {
  return useMutation({
    mutationKey: START_TRAINER_KEY,
    mutationFn: trainerService.startTrainer.bind(trainerService),
  });
};
