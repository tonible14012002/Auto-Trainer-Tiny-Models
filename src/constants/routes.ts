type BaseParams<T> = Record<string, any> & T;

export type ModelParams = BaseParams<{
  modelId: string;
}>;

export type TrainerParams = BaseParams<{
  trainerId: string;
}>

export const ROUTES = {
  EXPIRED: "/expired",
  HOME: "/",
  MODEL: (modelId: string) => `/${modelId}`,
  EXPERT_MODE: "/expert",
  TRAIN_DETAIL: (trainerId: number) => `/train/${trainerId}`,
};
