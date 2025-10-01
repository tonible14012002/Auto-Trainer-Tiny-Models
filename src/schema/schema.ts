// ============= Trainer Schemas =============

export type TrainerDetail = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TrainerConfigDetail = {
  id: number;
  trainerId: number;
  taskType: string;
  taskDescription: string;
  domainDescription: string;
  labelsConfig: any;
  refinedTaskDescription?: string | null;
  refinedDomainDescription?: string | null;
  refinedLabelsConfig?: any | null;
  budgetLimit?: number | null;
  budgetUsed: number;
  activatedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// ============= Request Types =============
// NOTE: JSON fields (objects/arrays) should be typed as `string` in request types
// because JSONSchemaType from Ajv cannot parse `any` types.
// These fields must be serialized to JSON strings before sending to the API,
// and parsed in the endpoint handler before passing to controllers.

export type CreateTrainerRequest = {
  name: string;
  description: string;
};

export type StartTrainerRequest = {
  trainerId: number;
  taskType: string;
  taskDescription: string;
  domainDescription: string;
  labelsConfig: string; // JSON string - must be parsed in endpoint
  budgetLimit?: number;
};
