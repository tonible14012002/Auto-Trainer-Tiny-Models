import {
  AutoModelForSequenceClassification,
  PreTrainedModel,
  PreTrainedTokenizer,
  SummarizationPipeline,
  Text2TextGenerationPipeline,
  TextGenerationPipeline,
  TextClassificationPipeline,
  ZeroShotClassificationPipeline,
  TokenClassificationPipeline,
  type ProgressInfo,
} from "@huggingface/transformers";
import { AutoTokenizer, pipeline } from "@huggingface/transformers";
import type { ModelDetail } from "@/schema/model";

type OnLoadModel = (event: ProgressInfo) => void;

export class ModelFactory {
  static modelMap = new Map<string, any>();

  static async initModel(
    modelId: string,
    task: ModelDetail["task"],
    modelPath: string,
    onLoad: OnLoadModel,
    modelConfig?: ModelDetail["config"]
  ) {
    // Return existing model if already loaded
    if (this.modelMap.has(modelId)) {
      console.log(`Model ${modelId} already loaded, returning cached instance`);
      return this.modelMap.get(modelId);
    }
    console.log(modelConfig);
    if (task === "none-pipline-supported") {
      const fetchModel = AutoModelForSequenceClassification.from_pretrained(
        modelPath,
        {
          progress_callback: onLoad,
          ...(modelConfig ?? {}),
        }
      );

      const fetchnTokenizer = AutoTokenizer.from_pretrained(modelPath, {
        progress_callback: onLoad,
        ...(modelConfig ?? {}),
      });

      const [model, tokenizer] = await Promise.all([
        fetchModel,
        fetchnTokenizer,
      ]);

      this.modelMap.set(modelId, {
        model,
        tokenizer,
      });
    } else {
      const model = await pipeline(task, modelPath, {
        progress_callback: onLoad,
        ...(modelConfig ?? {}),
      });

      this.modelMap.set(modelId, model);
      return model;
    }
  }

  static async runInferenceModel(
    modelId: string,
    task: ModelDetail["task"],
    input: string | string[],
    params: any
  ) {
    const model = this.modelMap.get(modelId);

    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    switch (task) {
      case "none-pipline-supported": {
        const tokenizer = model.tokenizer as PreTrainedTokenizer;
        const runModel = model.model as PreTrainedModel;

        const features = await tokenizer(["How much money has been sent?"], {
          text_pair: [input],
          padding: true,
          truncation: true,
        });

        const result = await runModel(features);
        return result.logits.data;
      }
      case "zero-shot-classification": {
        const typedModel = model as ZeroShotClassificationPipeline;
        // , params?.labels, params?.options
        const result = await typedModel(
          input as string | string[],
          params.labels,
          params.options
        );
        return result;
      }
      case "text-classification": {
        const typedModel = model as TextClassificationPipeline;
        const result = await typedModel(
          input as string | string[],
          params?.options
        );
        return result;
      }
      case "summarization": {
        const summarizer = model as SummarizationPipeline;
        const result = await summarizer(
          input as string | string[],
          params?.options
        );
        return result;
      }

      case "text2text-generation": {
        const generator = model as Text2TextGenerationPipeline;
        const result = await generator(
          input as string | string[],
          params?.options
        );
        return result;
      }

      case "text-generation": {
        const generator = model as TextGenerationPipeline;
        const result = await generator(
          input as string | string[],
          params?.options
        );
        return result;
      }

      case "sentiment-analysis": {
        const typedModel = model as TextClassificationPipeline;
        const result = await typedModel(
          input as string | string[],
          params?.options
        );
        return result;
      }
      case "token-classification": {
        const typedModel = model as TokenClassificationPipeline;
        const result = await typedModel(input as string | string[]);
        return result;
      }
      case "automatic-speech-recognition": {
        // TODO: Implement pipeline call
        return "Done";
      }
    }
  }
}
