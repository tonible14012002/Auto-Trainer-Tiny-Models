import { useMutation } from "@tanstack/react-query";
import { pipelineService } from "@/apis/pipeline";

const FIRST_GEN_KEY = ["phase", "first-gen"];

interface FirstGenParams {
  pipelineId: string;
}

export const useFirstGen = () => {
  return useMutation({
    mutationKey: FIRST_GEN_KEY,
    mutationFn: ({ pipelineId }: FirstGenParams) => {
      return pipelineService.firstGen({ pipeline_id: pipelineId });
    }
  });
};
