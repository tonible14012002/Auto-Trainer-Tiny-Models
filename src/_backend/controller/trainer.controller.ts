
import prisma, { PrismaTx } from "@/_backend/lib/prisma";
import { TrainerDetail, TrainerConfigDetail } from "@/schema/schema";
import {
  TrainerCreateInput,
  TrainerListOptions,
  TrainerConfigCreateInput,
  TrainerConfigUpdateInput,
} from "@/schema/request";

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

  getTrainer: async (trainerId: string) => {
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

  getTrainerDetail: async (trainerId: string) => {
    const prismaTrainer = await prisma.trainer.findFirst({
      where: {
        id: trainerId,
      },
      include: {
        configs: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!prismaTrainer) {
      throw new Error(`Trainer with id ${trainerId} not found`);
    }

    const trainer = mapPrismaTrainerToSchema(prismaTrainer);
    const configs = prismaTrainer.configs.map(mapPrismaTrainerConfigToSchema);

    // Find the active config (most recent one with activatedAt set)
    const activeConfig = configs
      .filter((config: TrainerConfigDetail) => config.activatedAt !== null)
      .sort((a: TrainerConfigDetail, b: TrainerConfigDetail) => {
        if (!a.activatedAt || !b.activatedAt) return 0;
        return b.activatedAt.getTime() - a.activatedAt.getTime();
      })[0] || null;

    return {
      ...trainer,
      configs,
      activeConfig,
    } as TrainerDetail;
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
    configId: string,
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