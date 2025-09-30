import { MODEL_WORKER_EVENT } from "@/constants/event";
import { useWorkerContext } from "@/provider/ModelWorkerProvider";
import type { WorkerMessage } from "@/schema/model";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export type TextClassificationInputParams = {
  text: string;
  options?: {
    top_k?: number;
    [key: string]: any;
  };
};

type TextClassificationResolver = (output: any) => void;

export const useInferenceTextClassification = (modelId?: string) => {
  const { worker, runModel } = useWorkerContext();
  const [isPending, setIsPending] = useState(false);
  const [inferenceId, setInferenceId] = useState("");
  const waiterPromiseRef = useRef<{
    resolver: TextClassificationResolver;
    rejecter: (reason?: any) => void;
  }>(null);

  const initWaiter = async () => {
    return new Promise((resolve: TextClassificationResolver, reject) => {
      waiterPromiseRef.current = {
        resolver: resolve,
        rejecter: reject,
      };
    });
  };
  const resetWaiter = () => {
    waiterPromiseRef.current = null;
  };

  const classify = async (input: TextClassificationInputParams) => {
    if (!modelId) {
      return;
    }
    if (waiterPromiseRef.current) {
      return;
    }
    try {
      setIsPending(true);
      const newInferenceId = uuidv4();
      setInferenceId(newInferenceId);
      await runModel(
        modelId,
        "text-classification",
        input.text,
        {
          options: input.options,
        },
        newInferenceId
      );
      const result = await initWaiter();
      setIsPending(false);
      return result;
    } catch (e: any) {
      console.error(e);
      toast("Error occurred while performing text classification", {
        description: e?.message || "Unknown Error",
      });
      resetWaiter();
    }
    setIsPending(false);
  };

  const handleResponse = useCallback(
    (e: MessageEvent) => {
      const msgData = e.data as WorkerMessage;
      const { type, data, threadId } = msgData;

      if (threadId !== inferenceId) {
        return;
      }

      if (type === MODEL_WORKER_EVENT.WORKER.inference_complete) {
        waiterPromiseRef.current?.resolver(data);
        waiterPromiseRef.current = null;
      }

      if (type === MODEL_WORKER_EVENT.WORKER.error) {
        waiterPromiseRef.current?.rejecter(data);
      }
    },
    [inferenceId]
  );

  useEffect(() => {
    if (!modelId) return;
    worker.current?.addEventListener("message", handleResponse);
    const clearRef = worker.current;
    return () => {
      clearRef?.removeEventListener("message", handleResponse);
    };
  }, [handleResponse, modelId, worker]);

  return {
    classify,
    isPending,
  };
};
