import type { ModelMainEvent, ModelWorkerEvent } from "@/constants/event";
import { type PretrainedModelOptions } from "@huggingface/transformers";

export type Category = "Language Processing" | "Vision" | "Audio" | "Multimodal" | "Other";

export type DType = 
| "auto"
| "bnb4"
| "fp16"
| "fp32"
| "int8"
| "q4"
| "q4f16"
| "q8"
| "uint8"

export type ModelDetail = {
  id: string; // app's ID
  category: Category; // Model category
  name: string; // Display name
  modelPath: string; // HuggingFace repo ID
  config?: Omit<PretrainedModelOptions, "progress_callback" | "dtype">;
  dtype?: DType;
  task:
    | "text-classification"
    | "zero-shot-classification"
    | "feature-extraction"
    | "summarization"
    | "text2text-generation" // for text2text-generation pipeline
    | "text-generation"
    | "sentiment-analysis"
    | "token-classification"
    | "automatic-speech-recognition"
    // Custom Task For manual lowerlevel API
    | "none-pipline-supported";

  // Model metadata
  metadata?: {
    description: string;
    huggingfaceUrl: string;
    modelSize?: string;
    author?: string;
  };

  // Loading information
  loadFiles: Record<string, FileLoadInfo>;
  loadTime?: number;
  loaded: boolean;
  loading?: boolean; // Track if model is currently being loaded
};

export type FileLoadInfo = {
  file: string;
  name: string;
  progress: number;
  loaded: number;
  total: number;
  status: "initiate" | "download" | "progress" | "done";
  duration: number;
};


// Model Interfaces

export type InitModelInput = {
  task: ModelDetail["task"];
  modelPath: string;
  config?: ModelDetail["config"];
  dtype?: DType;
};

export type ModelInferenceInput = {
  task: ModelDetail["task"];
  input: string | string[];
  params: {
    options?: any;
  };
};

export type WorkerMessage<T = any> = {
  modelId: string;
  type: ModelMainEvent | ModelWorkerEvent;
  threadId?: string;
  data?: T;
};

export type BaseInferenceResult<T = any> = {
  data: T;
  latency: number;
  task: ModelDetail["task"];
};

export type SummarizerResult = BaseInferenceResult<{ summary_text: string }[]>;

export type SentimentAnalysisResult = BaseInferenceResult<
  { label: string; score: number }[]
>;

export type Text2TextGenerationResult = BaseInferenceResult<
  { generated_text: string }[]
>;

export type ZeroShotClassificationResult = BaseInferenceResult<{
  sequence: string;
  labels: string[];
  scores: number[];
}>;

export type TokenClassificationResult = BaseInferenceResult<
  {
    entity: string;
    score: number;
    index: number;
    word: string;
  }[]
>;

export type TextClassificationResult = BaseInferenceResult<
  { label: string; score: number }[]
>;

export type AutomaticSpeechRecognitionResult = BaseInferenceResult<{
  text: string;
}>;

export type TextGenerationResult = BaseInferenceResult<
  { generated_text: string }[]
>;
