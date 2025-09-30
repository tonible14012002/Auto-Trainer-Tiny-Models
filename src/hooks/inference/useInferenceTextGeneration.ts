import { MODEL_WORKER_EVENT } from "@/constants/event";
import { useWorkerContext } from "@/provider/ModelWorkerProvider";
import type { TextGenerationResult, WorkerMessage } from "@/schema/model";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export type TextGenerationMessage = {
  role: "system" | "user";
  content: string;
};

export type TextGenerationInputParams = {
  messages: TextGenerationMessage[];
  options?: {
    max_new_tokens?: number;
    temperature?: number;
    top_p?: number;
    do_sample?: boolean;
    [key: string]: any;
  };
};

type TextGenerationResolver = (output: TextGenerationResult) => void;

export const useInferenceTextGeneration = (modelId?: string) => {
  const { worker, runModel } = useWorkerContext();
  const [isPending, setIsPending] = useState(false);
  const [inferenceId, setInferenceId] = useState("");
  const waiterPromiseRef = useRef<{
    resolver: TextGenerationResolver;
    rejecter: (reason?: any) => void;
  }>(null);

  const initWaiter = async () => {
    return new Promise((resolve: TextGenerationResolver, reject) => {
      waiterPromiseRef.current = {
        resolver: resolve,
        rejecter: reject,
      };
    });
  };
  
  const resetWaiter = () => {
    waiterPromiseRef.current = null;
  };

  const formatMessagesToPrompt = (messages: TextGenerationMessage[]): string => {
    return messages
      .map((message) => {
        if (message.role === "system") {
          return `System: ${message.content}`;
        } else {
          return `User: ${message.content}`;
        }
      })
      .join("\n") + "\nAssistant:";
  };

  const generate = async (input: TextGenerationInputParams) => {
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
      
      const promptText = formatMessagesToPrompt(input.messages);
      
      await runModel(
        modelId,
        "text-generation",
        promptText,
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
      toast("Error occurred while generating text", {
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
    generate,
    isPending,
  };
};