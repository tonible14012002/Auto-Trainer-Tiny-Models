
import prisma, { PrismaTx } from "@/_backend/lib/prisma";

export type TrainerCreateInput = {
  name: string;
  description: string;
};

export type TrainerListOptions = {
  limit?: number;
  offset?: number;
};

const mapPrismaTrainerToSchema = (prismaTrainer: any) => {
  return {
    id: prismaTrainer.id,
    name: prismaTrainer.name,
    description: prismaTrainer.description,
    createdAt: prismaTrainer.createdAt,
    updatedAt: prismaTrainer.updatedAt,
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
};