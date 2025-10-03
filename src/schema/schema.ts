// ============= Trainer Schemas =============

type JsonStr = string; // A string that contains JSON

export type CustomLabelConfig = {
  name: string;
  explanation: string;
  examples: string;
};

export type TrainerConfigDetail = {
  id: string;
  trainerId: string;
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

export type TrainerDetail = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  configs?: TrainerConfigDetail[];
  activeConfig?: TrainerConfigDetail | null;
};

export type CreateTrainerRequest = {
  name: string;
  description: string;
};

export type StartTrainerRequest = {
  trainerId: string;
  taskType: string;
  taskDescription: string;
  domainDescription: string;
  labelsConfig: JsonStr; // JSON string - must be parsed in endpoint
  budgetLimit?: number;
};
