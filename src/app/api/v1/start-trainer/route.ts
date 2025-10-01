import { NextRequest } from "next/server";
import Ajv, { JSONSchemaType } from "ajv";
import { TrainerController } from "@/_backend/controller/trainer.controller";
import { StartTrainerRequest, TrainerConfigDetail } from "@/schema/schema";
import { ResponseWithData } from "@/schema/response";

const startTrainerSchema: JSONSchemaType<StartTrainerRequest> = {
  type: "object",
  properties: {
    trainerId: { type: "integer" },
    taskType: { type: "string" },
    taskDescription: { type: "string" },
    domainDescription: { type: "string" },
    labelsConfig: { type: "string" },
    budgetLimit: { type: "number", nullable: true, optional: true },
  },
  required: ["trainerId", "taskType", "taskDescription", "domainDescription", "labelsConfig"],
  additionalProperties: false,
};

export async function POST(req: NextRequest) {
  const validator = new Ajv().compile(startTrainerSchema);
  try {
    const postData = (await req.json()) as StartTrainerRequest;
    if (validator(postData)) {
      // Parse labelsConfig from JSON string
      const labelsConfig = JSON.parse(postData.labelsConfig);

      const trainerConfig = await TrainerController.createTrainerConfig({
        ...postData,
        labelsConfig,
      });

      // Set activatedAt to current timestamp
      const activatedConfig = await TrainerController.updateTrainerConfig(
        trainerConfig.id,
        { activatedAt: new Date() }
      );

      return Response.json(
        {
          data: activatedConfig,
        } as ResponseWithData<TrainerConfigDetail>,
        {
          status: 201,
        }
      );
    } else {
      throw new Error("Invalid request data");
    }
  } catch (e) {
    console.error(
      "Error details:",
      e instanceof Error ? e.message : "Unknown error"
    );
    return Response.json(
      {
        status: 500,
        err: "Internal Server Error",
        errorCode: 400,
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
