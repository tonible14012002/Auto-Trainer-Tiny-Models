import { NextRequest } from "next/server";
import { TrainerController } from "@/_backend/controller/trainer.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trainerId = Number(params.id);

    if (isNaN(trainerId)) {
      return Response.json(
        {
          status: 400,
          err: "Invalid trainer ID",
          errorCode: 400,
        },
        { status: 400 }
      );
    }

    const trainer = await TrainerController.getTrainer(trainerId);
    return Response.json({ data: trainer }, { status: 200 });
  } catch (e) {
    console.error(
      "Error details:",
      e instanceof Error ? e.message : "Unknown error"
    );

    if (e instanceof Error && e.message.includes("not found")) {
      return Response.json(
        {
          status: 404,
          err: "Trainer not found",
          errorCode: 404,
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        status: 500,
        err: "Internal Server Error",
        errorCode: 500,
      },
      { status: 500 }
    );
  }
}