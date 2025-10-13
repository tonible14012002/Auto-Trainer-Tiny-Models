type BaseParams<T> = Record<string, any> & T;

export type ModelParams = BaseParams<{
  modelId: string;
}>;

export type PipelineParams = BaseParams<{
  pipelineId: string;
}>

export const ROUTES = {
  EXPIRED: "/expired",
  HOME: "/",
  MODEL: (modelId: string) => `/${modelId}`,
  EXPERT_MODE: "/expert",
  PIPELINE_DETAIL: (trainerId: string) => `/pipeline/${trainerId}`,
};
