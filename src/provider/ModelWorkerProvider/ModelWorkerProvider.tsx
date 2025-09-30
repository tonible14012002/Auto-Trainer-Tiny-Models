"use client";

import { MODEL_WORKER_EVENT } from "@/constants/event";
import type { PropsWithChildren, RefObject } from "react";
import { memo, useEffect, useRef, useState } from "react";
import { createContext } from "@/lib/utils";
import { makeMessage } from "@/utils/worker";
import type {
  ModelDetail,
  ModelInferenceInput,
  WorkerMessage,
} from "@/schema/model";

interface ModelWorkerContextValues {
  loadModel: (model: ModelDetail) => Promise<void>;
  worker: RefObject<Worker | null>;
  isWorkerReady: boolean;
  runModel: (
    modelId: string,
    task: ModelDetail["task"],
    input: string | string[],
    params: any,
    threadId?: string
  ) => Promise<void>;
}

// Custom utils force context MUST be available
const [Provider, useWorkerContext] = createContext<ModelWorkerContextValues>();

export { useWorkerContext };

export const ModelWorkerProvider = memo(({ children }: PropsWithChildren) => {
  const workerRef = useRef<Worker | null>(null);
  const [isWorkerReady, setIsWorkerReady] = useState(false);

  const onLoadModel = async (model: ModelDetail) => {
    if (!workerRef.current) return;
    workerRef.current.postMessage(
      makeMessage({
        modelId: model.id,
        type: MODEL_WORKER_EVENT.MAIN.init_model,
        data: {
          task: model.task,
          modelPath: model.modelPath,
          config: {
            dtype: model.dtype || "auto",
            ...(model.config || {}),
          },
          dtype: model.dtype || "auto",
        },
      })
    );
  };

  const runModel = async (
    modelId: string,
    task: ModelDetail["task"],
    input: string | string[],
    params: any,
    threadId?: string
  ) => {
    if (!workerRef.current) return;
    workerRef.current.postMessage(
      makeMessage({
        modelId: modelId,
        type: MODEL_WORKER_EVENT.MAIN.inference,
        data: {
          input,
          task,
          params,
        } as ModelInferenceInput,
        threadId,
      })
    );
  };

  useEffect(() => {
    if (workerRef.current) return;
    workerRef.current ??= new Worker(
      new URL("./worker/loadModelWorker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    workerRef.current.addEventListener("message", (event) => {
      const data = event.data as WorkerMessage;
      if (data.type === MODEL_WORKER_EVENT.WORKER.worker_ready) {
        console.log("Model Worker Ready");
        setIsWorkerReady(true);
      }
    });
  }, []);

  return (
    <Provider
      value={{
        isWorkerReady,
        loadModel: onLoadModel,
        worker: workerRef,
        runModel,
      }}
    >
      {children}
    </Provider>
  );
});

ModelWorkerProvider.displayName = "ModelWorkerProvider";
