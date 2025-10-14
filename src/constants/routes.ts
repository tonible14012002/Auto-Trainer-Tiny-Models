type BaseParams<T> = Record<string, any> & T;

export type ModelParams = BaseParams<{
  modelId: string;
}>;

export type PipelineParams = BaseParams<{
  pipelineId: string;
}>;

export type PipelinePhaseParams = PipelineParams & {
  phaseId: string;
};

export const ROUTES = {
  EXPIRED: "/expired",
  HOME: "/",
  MODEL: (modelId: string) => `/${modelId}`,
  EXPERT_MODE: "/expert",
  PIPELINE_DETAIL: (trainerId: string) => `/pipeline/${trainerId}`,
  PIPELINE_PHASE_DETAIL: (params: PipelinePhaseParams) =>
    `/pipeline/${params.pipelineId}/phases/${params.phaseId}`,
};
