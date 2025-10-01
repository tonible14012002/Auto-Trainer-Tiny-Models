
import prisma, { PrismaTx } from "@/_backend/lib/prisma";
import { TrainerDetail, TrainerConfigDetail } from "@/schema/schema";

export type TrainerCreateInput = {
  name: string;
  description: string;
};

export type TrainerListOptions = {
  limit?: number;
  offset?: number;
};

export type TrainerConfigCreateInput = {
  trainerId: number;
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

const mapPrismaTrainerToSchema = (prismaTrainer: any): TrainerDetail => {
  return {
    id: prismaTrainer.id,
    name: prismaTrainer.name,
    description: prismaTrainer.description,
    createdAt: prismaTrainer.createdAt,
    updatedAt: prismaTrainer.updatedAt,
  };
};

const mapPrismaTrainerConfigToSchema = (prismaTrainerConfig: any): TrainerConfigDetail => {
  return {
    id: prismaTrainerConfig.id,
    trainerId: prismaTrainerConfig.trainerId,
    taskType: prismaTrainerConfig.taskType,
    taskDescription: prismaTrainerConfig.taskDescription,
    domainDescription: prismaTrainerConfig.domainDescription,
    labelsConfig: prismaTrainerConfig.labelsConfig,
    refinedTaskDescription: prismaTrainerConfig.refinedTaskDescription,
    refinedDomainDescription: prismaTrainerConfig.refinedDomainDescription,
    refinedLabelsConfig: prismaTrainerConfig.refinedLabelsConfig,
    budgetLimit: prismaTrainerConfig.budgetLimit,
    budgetUsed: prismaTrainerConfig.budgetUsed,
    activatedAt: prismaTrainerConfig.activated_at,
    createdAt: prismaTrainerConfig.createdAt,
    updatedAt: prismaTrainerConfig.updatedAt,
  };
};

export const TrainerController = {
  createTrainer: async (input: TrainerCreateInput, tx?: PrismaTx) => {
    if (!tx) {
      tx = prisma;
    }

    const prismaTrainer = await tx.trainer.create({
      data: {
        name: input.name,
        description: input.description,
      },
    });

    return mapPrismaTrainerToSchema(prismaTrainer);
  },

  listTrainers: async (options?: TrainerListOptions) => {
    const { limit, offset } = options || {};

    const prismaTrainers = await prisma.trainer.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: "desc",
      },
    });

    return prismaTrainers.map(mapPrismaTrainerToSchema);
  },

  getTrainer: async (trainerId: number) => {
    const prismaTrainer = await prisma.trainer.findFirst({
      where: {
        id: trainerId,
      },
    });

    if (!prismaTrainer) {
      throw new Error(`Trainer with id ${trainerId} not found`);
    }

    return mapPrismaTrainerToSchema(prismaTrainer);
  },

  createTrainerConfig: async (input: TrainerConfigCreateInput, tx?: PrismaTx) => {
    if (!tx) {
      tx = prisma;
    }

    const prismaTrainerConfig = await tx.trainerConfig.create({
      data: {
        trainerId: input.trainerId,
        taskType: input.taskType,
        taskDescription: input.taskDescription,
        domainDescription: input.domainDescription,
        labelsConfig: input.labelsConfig,
        budgetLimit: input.budgetLimit,
      },
    });

    return mapPrismaTrainerConfigToSchema(prismaTrainerConfig);
  },

  updateTrainerConfig: async (
    configId: number,
    input: TrainerConfigUpdateInput,
    tx?: PrismaTx
  ) => {
    if (!tx) {
      tx = prisma;
    }

    const prismaTrainerConfig = await tx.trainerConfig.update({
      where: {
        id: configId,
      },
      data: {
        refinedTaskDescription: input.refinedTaskDescription,
        refinedDomainDescription: input.refinedDomainDescription,
        refinedLabelsConfig: input.refinedLabelsConfig,
        budgetLimit: input.budgetLimit,
        budgetUsed: input.budgetUsed,
        activated_at: input.activatedAt,
      },
    });

    return mapPrismaTrainerConfigToSchema(prismaTrainerConfig);
  },
};