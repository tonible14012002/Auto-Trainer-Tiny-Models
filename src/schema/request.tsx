// ============= Trainer Request Types =============

export type TrainerCreateInput = {
  name: string;
  description: string;
};

export type TrainerListOptions = {
  limit?: number;
  offset?: number;
};

export type TrainerConfigCreateInput = {
  trainerId: string;
  taskType: string;
  taskDescription: string;
  domainDescription: string;
  labelsConfig: any;
  budgetLimit?: number;
};

export type TrainerConfigUpdateInput = {
  refinedTaskDescription?: string;
  refinedDomainDescription?: string;
  refinedLabelsConfig?: any;
  budgetLimit?: number;
  budgetUsed?: number;
  activatedAt?: Date;
};
