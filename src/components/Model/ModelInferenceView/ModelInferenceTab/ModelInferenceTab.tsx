"use client";

import {
  useInferenceSummarizer,
  type SummarizerInputParams,
} from "@/hooks/inference/useInferenceSummarizer";
import type { ModelDetail } from "@/schema/model";
import { SummarizeInferenceForm } from "./InferenceForm/SummarizeInferenceForm";
import { SummarizeResultPanel } from "./ResultPanel";
import { useState } from "react";
import { SentimentAnalysisForm } from "./InferenceForm/SentimentAnalysisForm";
import {
  useInferenceSentimentAnalysis,
  type SentimentAnalysisInputParams,
} from "@/hooks/inference/useInferenceSentimentAnalysis";
import { SentimentAnalysisResultPanel } from "./ResultPanel/SentimentAnalysisResultPanel";
import { Badge } from "@/components/ui/badge";
import { formatReadableDurationInMs } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Text2TextGenerationForm } from "./InferenceForm/Text2TextGenerationForm";
import { useInferenceText2Text } from "@/hooks/inference/useInferenceText2Text";
import { Text2TextResultPanel } from "./ResultPanel/Text2TextResultPanel";
import { ZeroShotClassificationForm } from "./InferenceForm/ZeroShotClassificationForm";
import {
  useInferenceZeroShotClassification,
  type ZeroShotClassificationInputParams,
} from "@/hooks/inference/useInferenceZeroShotClassification";
import { ZeroShotClassificationResultPanel } from "./ResultPanel/ZeroShotClassificationResultPanel";
import { TokenClassificationForm } from "./InferenceForm/TokenClassificationForm";
import {
  useInferenceTokenClassification,
  type TokenClassificationInputParams,
} from "@/hooks/inference/useInferenceTokenClassification";
import { TokenClassificationResultPanel } from "./ResultPanel/TokenClassificationResultPanel";
import { TextClassificationForm } from "./InferenceForm/TextClassificationForm";
import {
  useInferenceTextClassification,
  type TextClassificationInputParams,
} from "@/hooks/inference/useInferenceTextClassification";
import { TextClassificationResultPanel } from "./ResultPanel/TextClassificationResultPanel";
import { AutomaticSpeechRecognitionForm } from "./InferenceForm/AutomaticSpeechRecognitionForm";
import {
  useInferenceAutomaticSpeechRecognition,
  type AutomaticSpeechRecognitionInputParams,
} from "@/hooks/inference/useInferenceAutomaticSpeechRecognition";
import { AutomaticSpeechRecognitionResultPanel } from "./ResultPanel/AutomaticSpeechRecognitionResultPanel";
import { TextGenerationForm } from "./InferenceForm/TextGenerationForm";
import {
  useInferenceTextGeneration,
  type TextGenerationInputParams,
} from "@/hooks/inference/useInferenceTextGeneration";
import { TextGenerationResultPanel } from "./ResultPanel/TextGenerationResultPanel";
import { useModels } from "@/provider/ModelsProvider";

interface ModelInferenceTabProps {
  model: ModelDetail;
}

export const ModelInferenceTab = (props: ModelInferenceTabProps) => {
  const { model } = props;
  const { isInfering, setIsInfering } = useModels();
  const { summarize } = useInferenceSummarizer(model.id);
  const { analyze } = useInferenceSentimentAnalysis(model.id);

  const { generate } = useInferenceText2Text(model.id);

  const { classify } = useInferenceZeroShotClassification(model.id);

  const { classify: classifyTokens } = useInferenceTokenClassification(
    model.id
  );

  const { classify: classifyText } = useInferenceTextClassification(model.id);

  const { transcribe } = useInferenceAutomaticSpeechRecognition(model.id);

  const { generate: generateText } = useInferenceTextGeneration(model.id);

  const [result, setResult] = useState<any>(null);

  const onInference = async (data: any) => {
    setIsInfering(true);
    try {
      switch (model.task) {
        case "summarization":
          {
            setResult(null);
            const result = await summarize({
              text: data.input,
            } as SummarizerInputParams);

            setResult(result);
          }
          break;

        case "sentiment-analysis":
          {
            setResult(null);
            const result = await analyze({
              text: data.input,
              options: {
                top_k: data.topK === "null" ? null : Number(data.topK),
              },
            } as SentimentAnalysisInputParams);
            setResult(result);
          }
          break;
        case "text2text-generation":
          {
            setResult(null);
            const result = await generate({
              text: data.input,
              options:
                data.max_new_tokens && !isNaN(Number(data.max_new_tokens))
                  ? {
                      max_new_tokens: Number(data.max_new_tokens),
                    }
                  : undefined,
            });
            setResult(result);
          }
          break;
        case "zero-shot-classification":
          {
            setResult(null);
            const result = await classify({
              text: data.text,
              labels: data.labels,
              template: data.template,
            } as ZeroShotClassificationInputParams);
            setResult(result);
          }
          break;
        case "token-classification":
          {
            setResult(null);
            const result = await classifyTokens({
              text: data.text,
              options: data.options,
            } as TokenClassificationInputParams);
            setResult(result);
          }
          break;
        case "text-classification":
          {
            setResult(null);
            const result = await classifyText({
              text: data.input,
              options: {
                top_k: data.topK === "null" ? null : Number(data.topK),
              },
            } as TextClassificationInputParams);
            setResult(result);
          }
          break;
        case "automatic-speech-recognition":
          {
            setResult(null);
            const url =
              data.inputType === "url"
                ? data.audioUrl
                : URL.createObjectURL(data.audioFile);
            const result = await transcribe({
              text: url,
              inputType: data.inputType,
            } as AutomaticSpeechRecognitionInputParams);
            URL.revokeObjectURL(url);
            setResult(result);
          }
          break;
        case "text-generation":
          {
            setResult(null);
            const result = await generateText({
              messages: data.messages,
              options: data.options,
            } as TextGenerationInputParams);
            setResult(result);
          }
          break;
      }
      setIsInfering(false);
    } catch (e) {
      console.log(e);
      setIsInfering(false);
    }
  };

  return (
    <>
      {getInferenceForm({
        model,
        onInferenceSubmit: onInference,
      })}
      <div className="rounded-lg space-y-2 p-4 mt-4 border">
        <h3 className="font-semibold text-xs md:text-sm mb-3">
          Inference Result
        </h3>
        {result && result.latency && (
          <div className="">
            <Badge>Latency: {formatReadableDurationInMs(result.latency)}</Badge>
          </div>
        )}
        {isInfering && (
          <div className="">
            <Skeleton className="h-[22px] w-[40px]" />
          </div>
        )}
        {getInferenceResultPanel({
          model,
          isPending: isInfering,
          result,
        })}
      </div>
    </>
  );
};

type GetInferenceFormParams = {
  model: ModelDetail;
  onInferenceSubmit?: (_: any) => void;
};

const getInferenceForm = ({
  model,
  onInferenceSubmit,
}: GetInferenceFormParams) => {
  let Form: any = null;
  switch (model.task) {
    case "summarization":
      Form = SummarizeInferenceForm;
      break;
    case "sentiment-analysis":
      Form = SentimentAnalysisForm;
      break;
    case "text2text-generation":
      Form = Text2TextGenerationForm;
      break;
    case "zero-shot-classification":
      Form = ZeroShotClassificationForm;
      break;
    case "token-classification":
      Form = TokenClassificationForm;
      break;
    case "text-classification":
      Form = TextClassificationForm;
      break;
    case "automatic-speech-recognition":
      Form = AutomaticSpeechRecognitionForm;
      break;
    case "text-generation":
      Form = TextGenerationForm;
      break;
  }

  if (!Form) {
    return null;
  }

  return (
    <Form
      onInferenceSubmit={onInferenceSubmit}
      modelId={model.id}
      disabled={!model.loadTime || model.loadTime <= 0}
    />
  );
};

type GetInferenceResultPanelParams = {
  model: ModelDetail;
  isPending?: boolean;
  result: any;
};

const getInferenceResultPanel = ({
  model,
  isPending,
  result,
}: GetInferenceResultPanelParams) => {
  let PanelComp: any = null;
  switch (model.task) {
    case "summarization":
      PanelComp = SummarizeResultPanel;
      break;
    case "sentiment-analysis":
      PanelComp = SentimentAnalysisResultPanel;
      break;
    case "text2text-generation":
      PanelComp = Text2TextResultPanel;
      break;
    case "zero-shot-classification":
      PanelComp = ZeroShotClassificationResultPanel;
      break;
    case "token-classification":
      PanelComp = TokenClassificationResultPanel;
      break;
    case "text-classification":
      PanelComp = TextClassificationResultPanel;
      break;
    case "automatic-speech-recognition":
      PanelComp = AutomaticSpeechRecognitionResultPanel;
      break;
    case "text-generation":
      PanelComp = TextGenerationResultPanel;
      break;
  }

  if (!PanelComp) {
    return null;
  }

  return <PanelComp isPending={isPending} result={result} />;
};
