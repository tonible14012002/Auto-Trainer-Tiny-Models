import { NextRequest } from "next/server";
import { TrainerController } from "@/_backend/controller/trainer.controller";
import { TrainerDetail } from "@/schema/schema";
import { ResponseWithData } from "@/schema/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const trainerDetail = await TrainerController.getTrainerDetail(id);
    return Response.json(
      { data: trainerDetail } as ResponseWithData<TrainerDetail>,
      { status: 200 }
    );
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