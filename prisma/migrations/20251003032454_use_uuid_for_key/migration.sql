/*
  Warnings:

  - The primary key for the `DatasetGenerationJob` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Trainer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TrainerConfig` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TrainerDataset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TrainerEvaluation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TrainerPipeline` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TrainingJob` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."DatasetGenerationJob" DROP CONSTRAINT "DatasetGenerationJob_trainerDatasetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DatasetGenerationJob" DROP CONSTRAINT "DatasetGenerationJob_trainer_pipeline_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrainerConfig" DROP CONSTRAINT "TrainerConfig_trainer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrainerDataset" DROP CONSTRAINT "TrainerDataset_trainer_pipeline_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrainerEvaluation" DROP CONSTRAINT "TrainerEvaluation_trainer_pipeline_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrainerPipeline" DROP CONSTRAINT "TrainerPipeline_trainer_config_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrainingJob" DROP CONSTRAINT "TrainingJob_trainer_pipeline_id_fkey";

-- AlterTable
ALTER TABLE "public"."DatasetGenerationJob" DROP CONSTRAINT "DatasetGenerationJob_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "trainer_pipeline_id" SET DATA TYPE TEXT,
ALTER COLUMN "trainerDatasetId" SET DATA TYPE TEXT,
ADD CONSTRAINT "DatasetGenerationJob_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DatasetGenerationJob_id_seq";

-- AlterTable
ALTER TABLE "public"."Trainer" DROP CONSTRAINT "Trainer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Trainer_id_seq";

-- AlterTable
ALTER TABLE "public"."TrainerConfig" DROP CONSTRAINT "TrainerConfig_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "trainer_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TrainerConfig_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TrainerConfig_id_seq";

-- AlterTable
ALTER TABLE "public"."TrainerDataset" DROP CONSTRAINT "TrainerDataset_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "trainer_pipeline_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TrainerDataset_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TrainerDataset_id_seq";

-- AlterTable
ALTER TABLE "public"."TrainerEvaluation" DROP CONSTRAINT "TrainerEvaluation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "trainer_pipeline_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TrainerEvaluation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TrainerEvaluation_id_seq";

-- AlterTable
ALTER TABLE "public"."TrainerPipeline" DROP CONSTRAINT "TrainerPipeline_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "trainer_config_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TrainerPipeline_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TrainerPipeline_id_seq";

-- AlterTable
ALTER TABLE "public"."TrainingJob" DROP CONSTRAINT "TrainingJob_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "trainer_pipeline_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TrainingJob_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TrainingJob_id_seq";

-- CreateTable
CREATE TABLE "public"."SeedingHistory" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeedingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeedingHistory_fileName_key" ON "public"."SeedingHistory"("fileName");

-- AddForeignKey
ALTER TABLE "public"."TrainerConfig" ADD CONSTRAINT "TrainerConfig_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "public"."Trainer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."TrainerPipeline" ADD CONSTRAINT "TrainerPipeline_trainer_config_id_fkey" FOREIGN KEY ("trainer_config_id") REFERENCES "public"."TrainerConfig"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."TrainingJob" ADD CONSTRAINT "TrainingJob_trainer_pipeline_id_fkey" FOREIGN KEY ("trainer_pipeline_id") REFERENCES "public"."TrainerPipeline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."TrainerDataset" ADD CONSTRAINT "TrainerDataset_trainer_pipeline_id_fkey" FOREIGN KEY ("trainer_pipeline_id") REFERENCES "public"."TrainerPipeline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."DatasetGenerationJob" ADD CONSTRAINT "DatasetGenerationJob_trainerDatasetId_fkey" FOREIGN KEY ("trainerDatasetId") REFERENCES "public"."TrainerDataset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."DatasetGenerationJob" ADD CONSTRAINT "DatasetGenerationJob_trainer_pipeline_id_fkey" FOREIGN KEY ("trainer_pipeline_id") REFERENCES "public"."TrainerPipeline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."TrainerEvaluation" ADD CONSTRAINT "TrainerEvaluation_trainer_pipeline_id_fkey" FOREIGN KEY ("trainer_pipeline_id") REFERENCES "public"."TrainerPipeline"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
