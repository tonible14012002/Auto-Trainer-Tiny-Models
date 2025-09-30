type BaseParams<T> = Record<string, any> & T;

export type ModelParams = BaseParams<{
  modelId: string;
}>;

export const ROUTES = {
  EXPIRED: "/expired",
  HOME: "/",
  MODEL: (modelId: string) => `/${modelId}`,
  EXPERT_MODE: "/expert",
  TRAIN_CREATE: "/train/create",
  TRAIN_DETAIL: (trainerId: number) => `/train/${trainerId}`,
};
