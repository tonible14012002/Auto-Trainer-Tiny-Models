-- CreateTable
CREATE TABLE "public"."TrainerConfig" (
    "id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activated_at" TIMESTAMPTZ(6),
    "task_type" TEXT NOT NULL,
    "task_description" TEXT NOT NULL,
    "domain_description" TEXT NOT NULL,
    "label_config" JSONB NOT NULL,
    "refined_task_description" TEXT,
    "refined_domain_description" TEXT,
    "refined_label_config" JSONB,
    "budget_limit" DECIMAL(65,30),
    "budget_used" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "TrainerConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrainerPipeline" (
    "id" SERIAL NOT NULL,
    "trainer_config_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainerPipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrainingJob" (
    "id" SERIAL NOT NULL,
    "trainer_pipeline_id" INTEGER NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL,
    "end_at" TIMESTAMPTZ(6),
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrainerDataset" (
    "id" SERIAL NOT NULL,
    "trainer_pipeline_id" INTEGER NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_type" TEXT NOT NULL,
    "record_count" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainerDataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DatasetGenerationJob" (
    "id" SERIAL NOT NULL,
    "trainer_pipeline_id" INTEGER NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL,
    "end_at" TIMESTAMPTZ(6),
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trainerDatasetId" INTEGER NOT NULL,

    CONSTRAINT "DatasetGenerationJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrainerEvaluation" (
    "id" SERIAL NOT NULL,
    "trainer_pipeline_id" INTEGER NOT NULL,
    "metrics" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainerEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainerPipeline_trainer_config_id_key" ON "public"."TrainerPipeline"("trainer_config_id");

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
