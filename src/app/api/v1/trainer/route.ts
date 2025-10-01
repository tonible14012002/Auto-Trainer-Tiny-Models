import { NextRequest } from "next/server";
import Ajv, { JSONSchemaType } from "ajv";
import { TrainerController } from "@/_backend/controller/trainer.controller";
import { CreateTrainerRequest, TrainerDetail } from "@/schema/schema";
import { ResponseWithData } from "@/schema/response";

const createTrainerSchema: JSONSchemaType<CreateTrainerRequest> = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
  },
  required: ["name", "description"],
  additionalProperties: false,
};

export async function POST(req: NextRequest) {
  const validator = new Ajv().compile(createTrainerSchema);
  try {
    const postData = (await req.json()) as CreateTrainerRequest;
    if (validator(postData)) {
      const trainer = await TrainerController.createTrainer(postData);

      return Response.json(
        {
          data: trainer,
        } as ResponseWithData<TrainerDetail>,
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

export async function GET(req: NextRequest) {
  const limit = req.nextUrl.searchParams.get("limit");
  const offset = req.nextUrl.searchParams.get("offset");

  try {
    const trainers = await TrainerController.listTrainers({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
    return Response.json(
      { data: trainers } as ResponseWithData<TrainerDetail[]>,
      { status: 200 }
    );
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
      { status: 500 }
    );
  }
}