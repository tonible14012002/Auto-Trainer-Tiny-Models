import { MODEL_WORKER_EVENT } from "@/constants/event";
import { useWorkerContext } from "@/provider/ModelWorkerProvider";
import type {
  AutomaticSpeechRecognitionResult,
  WorkerMessage,
} from "@/schema/model";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { pipeline } from "@huggingface/transformers";
import { v4 as uuidv4 } from "uuid";
import { useModels } from "@/provider/ModelsProvider";

export type AutomaticSpeechRecognitionInputParams = {
  text: string;
  inputType?: "url" | "file";
};

type ASRResolver = (_: AutomaticSpeechRecognitionResult) => void;

export const useInferenceAutomaticSpeechRecognition = (modelId?: string) => {
  const { worker, runModel } = useWorkerContext();
  const { models } = useModels();

  const modelDetail = useMemo(() => {
    return models.find((model) => model.id === modelId);
  }, [modelId, models]);

  const [isPending, setIsPending] = useState(false);
  const [inferenceId, setInferenceId] = useState("");
  const waiterPromiseRef = useRef<{
    resolver: ASRResolver;
    rejecter: (reason?: any) => void;
  }>(null);

  const initWaiter = async () => {
    return new Promise((resolve: ASRResolver, reject) => {
      waiterPromiseRef.current = {
        resolver: resolve,
        rejecter: reject,
      };
    });
  };
  const resetWaiter = () => {
    waiterPromiseRef.current = null;
  };

  const transcribe = async (input: AutomaticSpeechRecognitionInputParams) => {
    if (!modelId || !modelDetail) {
      return;
    }
    if (waiterPromiseRef.current) {
      return;
    }
    try {
      setIsPending(true);
      const newInferenceId = uuidv4();
      setInferenceId(newInferenceId);

      // TODO: Implement pipeline call
      await runModel(
        modelId,
        "automatic-speech-recognition",
        input.text,
        {},
        newInferenceId
      );
      await initWaiter();
      // NOTE: The WebWorker not support AudioContext API.
      // For this Task, the worker script only for loading the Model into cache
      const autoSpeechRecognizer = await pipeline(
        "automatic-speech-recognition",
        modelDetail.modelPath,
        {}
      );

      console.log("ASR autoSpeechRecognizer", input);

      let latency = 0;
      const now = performance.now();
      const modelResult = await autoSpeechRecognizer(input.text, {});
      console.log("ASR modelResult", modelResult);
      latency = performance.now() - now;

      setIsPending(false);
      return {
        latency,
        data: modelResult,
        task: "automatic-speech-recognition",
      } as AutomaticSpeechRecognitionResult;
    } catch (e: any) {
      console.error(e);
      toast("Error occurred while transcribing audio", {
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
    transcribe,
    isPending,
  };
};
