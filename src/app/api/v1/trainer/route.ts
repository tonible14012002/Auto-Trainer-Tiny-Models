import { NextRequest } from "next/server";
import Ajv, { JSONSchemaType } from "ajv";
import { TrainerController, TrainerCreateInput } from "@/_backend/controller/trainer.controller";

type InputRequestType = TrainerCreateInput;
const createTrainerSchema: JSONSchemaType<InputRequestType> = {
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
    const postData = (await req.json()) as InputRequestType;
    if (validator(postData)) {
      const trainer = await TrainerController.createTrainer(postData);

      return Response.json(
        {
          data: trainer,
        },
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
    return Response.json({ data: trainers }, { status: 200 });
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