/*
  Warnings:

  - You are about to drop the `TrainingProcess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."TrainingProcess";

-- CreateTable
CREATE TABLE "public"."Trainer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);
