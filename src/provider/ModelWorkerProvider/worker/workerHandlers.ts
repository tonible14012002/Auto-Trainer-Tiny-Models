import { MODEL_WORKER_EVENT } from "@/constants/event";
import { endTimer, makeMessage, startTimer } from "@/utils/worker";
import type {
  FileLoadInfo,
  InitModelInput,
  ModelInferenceInput,
  WorkerMessage,
} from "@/schema/model";
import {
  ProgressInfo,
  //   InitiateProgressInfo,
  // DownloadProgressInfo,
  // ProgressStatusInfo,
  // DoneProgressInfo,
} from "@huggingface/transformers";
// import type {
//   // ProgressInfo,
//   InitiateProgressInfo,
//   DownloadProgressInfo,
//   ProgressStatusInfo,
//   DoneProgressInfo,
// } from "/@huggingface/transformers/dist/esm/inference";
import { ModelFactory } from "./ModelFactory";

type ProgressStatusInfo = {
  status: "progress";
  name: string;
  file: string;
  progress: number;
  loaded: number;
  total: number;
};

type OtherProgressInfo = {
  status: "initiate" | "download" | "done";
  name: string;
  file: string;
};

// Helper type
export type ProgressInput =
  | ProgressStatusInfo
  | OtherProgressInfo

export const eventHandlers = {
  handleMessage: (message: WorkerMessage) => {
    switch (message.type) {
      case MODEL_WORKER_EVENT.MAIN.init_model:
        eventHandlers.initModel(
          message.modelId,
          message.data as InitModelInput
        );
        break;
      case MODEL_WORKER_EVENT.MAIN.inference:
        eventHandlers.runInference(
          message.modelId,
          message.data as ModelInferenceInput,
          message.threadId
        );
        break;
    }
  },

  initModel: async (
    modelId: string,
    data: InitModelInput,
    threadId?: string
  ) => {
    const timeTrack = {} as any;
    const loadStatus: Record<string, FileLoadInfo> = {};
    try {
      await ModelFactory.initModel(
        modelId,
        data.task,
        data.modelPath,
        (baseProgress: ProgressInfo) => {
          if (baseProgress.status !== "ready") {
            const progressInfo = baseProgress as ProgressInput;
            loadStatus[progressInfo.file] = {
              ...(loadStatus[progressInfo.file] || {}),
              ...progressInfo,
            };
            loadStatus[progressInfo.file] = {
              ...loadStatus[progressInfo.file],
              loaded: loadStatus[progressInfo.file].loaded || 0,
              total: loadStatus[progressInfo.file].total || 0,
              progress: loadStatus[progressInfo.file].progress || 0,
              duration: loadStatus[progressInfo.file].duration || 0,
            };
            if (progressInfo.status === "initiate") {
              startTimer(timeTrack, progressInfo.file);
            } else {
              endTimer(timeTrack, progressInfo.file);
            }
            const isAllDownloadDone = Object.values(loadStatus).every(
              (info) => info.status === "done"
            );
            if (isAllDownloadDone) {
              self.postMessage(
                makeMessage({
                  type: MODEL_WORKER_EVENT.WORKER.downloaded,
                  modelId: modelId,
                  threadId,
                  data: {
                    timeTrack,
                    loadStatus,
                  },
                })
              );
              startTimer(timeTrack, "modelLoadTime");
            } else {
              self.postMessage(
                makeMessage({
                  type: MODEL_WORKER_EVENT.WORKER.downloading,
                  modelId: modelId,
                  threadId,
                  data: {
                    timeTrack,
                    loadStatus,
                  },
                })
              );
            }
          } else {
            self.postMessage(
              makeMessage({
                type: MODEL_WORKER_EVENT.WORKER.loaded,
                threadId,
                modelId: modelId,
                data: {
                  timeTrack,
                  loadStatus,
                },
              })
            );
          }
        },
        data.config
      );
      if (timeTrack["modelLoadTime"]) {
        endTimer(timeTrack, "modelLoadTime");
      }
      self.postMessage(
        makeMessage({
          type: MODEL_WORKER_EVENT.WORKER.ready,
          modelId: modelId,
          threadId,
          data: {
            timeTrack,
            loadStatus,
          },
        })
      );
    } catch (error: any) {
      self.postMessage(
        makeMessage({
          type: MODEL_WORKER_EVENT.WORKER.error,
          threadId,
          modelId: modelId,
          data: {
            error: error?.message || String(error) || "Some error occurred",
          },
        })
      );
    }
  },

  runInference: async (
    modelId: string,
    data: ModelInferenceInput,
    threadId?: string
  ) => {
    try {
      const latency = performance.now();
      const result = await ModelFactory.runInferenceModel(
        modelId,
        data.task,
        data.input,
        data.params
      );
      self.postMessage(
        makeMessage({
          data: {
            data: result,
            latency: performance.now() - latency,
            task: data.task,
          },
          modelId: modelId,
          type: MODEL_WORKER_EVENT.WORKER.inference_complete,
          threadId,
        })
      );
    } catch (e: any) {
      self.postMessage(
        makeMessage({
          type: MODEL_WORKER_EVENT.WORKER.error,
          modelId: modelId,
          data: {
            error: e?.message || String(e) || "Some error occurred",
          },
          threadId,
        })
      );
    }
  },
};
