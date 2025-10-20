import { pipelineService } from "@/apis/pipeline";
import { useQuery } from "@tanstack/react-query";

export const PHASE_DETAIL_QUERY_KEY = "PhaseDetail";

interface Options {
  ignoreRefetch?: boolean;
}

export const useFetchPhase = (phaseId: string, options: Options = {}) => {
  return useQuery({
    queryKey: [PHASE_DETAIL_QUERY_KEY, phaseId],
    queryFn: () => pipelineService.getPhase(phaseId),
    ...(options
      ? {
          enabled: !options.ignoreRefetch,
        }
      : null),
  });
};
