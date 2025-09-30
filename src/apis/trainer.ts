import { Client } from "@/lib/client";
import fetcher from "@/lib/fetcher";
import QueryString from "qs";
import { ResponseWithData } from "@/schema/response";

export interface TrainerDetail {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

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

  getTrainer(trainerId: number) {
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
}

export const trainerService = new TrainerService();