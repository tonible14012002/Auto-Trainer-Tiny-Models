
import { MODEL_WORKER_EVENT } from "@/constants/event";
import { makeMessage } from "@/utils/worker";
import type { WorkerMessage } from "@/schema/model";
import { eventHandlers } from "./workerHandlers";

self.addEventListener("message", async (event) => {
  const message = event.data as WorkerMessage;
  eventHandlers.handleMessage(message);
});

// Worker Initialize Done
self.postMessage(
  makeMessage({
    modelId: "",
    type: MODEL_WORKER_EVENT.WORKER.worker_ready,
  })
);
