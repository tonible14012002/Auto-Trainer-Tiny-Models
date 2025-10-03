import { Client } from "@/lib/client";
import fetcher from "@/lib/fetcher";
import QueryString from "qs";
import { ResponseWithData } from "@/schema/response";
import { StartTrainerRequest, TrainerConfigDetail, TrainerDetail } from "@/schema/schema";

export interface ListTrainerQuery {
  limit?: number;
  offset?: number;
}

class TrainerService extends Client {
  getTrainers(q?: ListTrainerQuery) {
    const queryString = q ? `?${QueryString.stringify(q)}` : "";
    return fetcher<ResponseWithData<TrainerDetail[]>>(
      `${this.baseUrl}/v1/trainer${queryString}`
    );
  }

  getTrainer(trainerId: string) {
    return fetcher<ResponseWithData<TrainerDetail>>(
      `${this.baseUrl}/v1/trainer/${trainerId}`
    );
  }

  getTrainerDetail(trainerId: string) {
    return fetcher<ResponseWithData<TrainerDetail>>(
      `${this.baseUrl}/v1/trainer/${trainerId}`
    );
  }

  createTrainer(input: { name: string; description: string }) {
    return fetcher<ResponseWithData<TrainerDetail>>(
      `${this.baseUrl}/v1/trainer`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(input),
      }
    );
  }

  startTrainer(input: StartTrainerRequest) {
    return fetcher<ResponseWithData<TrainerConfigDetail>>(
      `${this.baseUrl}/v1/start-trainer`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(input),
      }
    );
  }
}

export const trainerService = new TrainerService();