"use client";

import { ROUTES } from "@/constants/routes";
import { useModels } from "@/provider/ModelsProvider";
import { LoaderCircle, Heart, LoaderIcon, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useWorkerContext } from "@/provider/ModelWorkerProvider";
import { useUserConfig } from "@/hooks/useUserConfig";
import { useFavorites } from "@/hooks/useFavorites";

// Import V2 Form Components
import {
  ZeroShotClassificationFormV2,
  SentimentAnalysisFormV2,
  SummarizeInferenceFormV2,
  Text2TextGenerationFormV2,
  TextClassificationFormV2,
  TokenClassificationFormV2,
  AutomaticSpeechRecognitionFormV2,
  TextGenerationFormV2,
} from "./InferenceFormV2";

// Import Result Panels
import { ZeroShotClassificationResultPanel } from "@/components/Model/ModelInferenceView/ModelInferenceTab/ResultPanel/ZeroShotClassificationResultPanel";
import { SentimentAnalysisResultPanel } from "@/components/Model/ModelInferenceView/ModelInferenceTab/ResultPanel/SentimentAnalysisResultPanel";
import { SummarizeResultPanel } from "@/components/Model/ModelInferenceView/ModelInferenceTab/ResultPanel/SummarizeResultPanel";
import { Text2TextResultPanel } from "@/components/Model/ModelInferenceView/ModelInferenceTab/ResultPanel/Text2TextResultPanel";
import { TextClassificationResultPanel } from "@/components/Model/ModelInferenceView/ModelInferenceTab/ResultPanel/TextClassificationResultPanel";
import { TokenClassificationResultPanel } from "@/components/Model/ModelInferenceView/ModelInferenceTab/ResultPanel/TokenClassificationResultPanel";
import { AutomaticSpeechRecognitionResultPanel } from "@/components/Model/ModelInferenceView/ModelInferenceTab/ResultPanel/AutomaticSpeechRecognitionResultPanel";
import { TextGenerationResultPanel } from "@/components/Model/ModelInferenceView/ModelInferenceTab/ResultPanel/TextGenerationResultPanel";

// Import Inference Hooks
import {
  useInferenceZeroShotClassification,
  type ZeroShotClassificationInputParams,
} from "@/hooks/inference/useInferenceZeroShotClassification";
import {
  useInferenceSentimentAnalysis,
  type SentimentAnalysisInputParams,
} from "@/hooks/inference/useInferenceSentimentAnalysis";
import {
  useInferenceSummarizer,
  type SummarizerInputParams,
} from "@/hooks/inference/useInferenceSummarizer";
import {
  useInferenceText2Text,
  type Text2TextGenerationInputParams,
} from "@/hooks/inference/useInferenceText2Text";
import {
  useInferenceTextClassification,
  type TextClassificationInputParams,
} from "@/hooks/inference/useInferenceTextClassification";
import {
  useInferenceTokenClassification,
  type TokenClassificationInputParams,
} from "@/hooks/inference/useInferenceTokenClassification";
import {
  useInferenceAutomaticSpeechRecognition,
  type AutomaticSpeechRecognitionInputParams,
} from "@/hooks/inference/useInferenceAutomaticSpeechRecognition";
import {
  useInferenceTextGeneration,
  type TextGenerationInputParams,
} from "@/hooks/inference/useInferenceTextGeneration";

// Import Types
import type {
  ZeroShotClassificationResult,
  SentimentAnalysisResult,
  SummarizerResult,
  Text2TextGenerationResult,
  TextClassificationResult,
  TokenClassificationResult,
  AutomaticSpeechRecognitionResult,
  TextGenerationResult,
} from "@/schema/model";
import type { ModelParams } from "@/constants/routes";
import { ModelInformation } from "@/components/Model/ModelInformation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getTotalFileInfo } from "@/utils/model";
import { formatReadableDurationInMs } from "@/utils/format";
import { useIsMobile } from "@/hooks/useIsMobile";
import { DownloadProgress } from "@/components/Model/DownloadProgress";
import { useParams, useRouter } from "next/navigation";

// Union type for all possible results - all extend BaseInferenceResult which now includes task field
type InferenceResult =
  | ZeroShotClassificationResult
  | SentimentAnalysisResult
  | SummarizerResult
  | Text2TextGenerationResult
  | TextClassificationResult
  | TokenClassificationResult
  | AutomaticSpeechRecognitionResult
  | TextGenerationResult
  | undefined;

export const ModelInferenceViewV2 = () => {
  const { selectedModel, setModelLoading } = useModels();
  const { loadModel } = useWorkerContext();
  const { config } = useUserConfig();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { modelId } = useParams<ModelParams>();
  const router = useRouter();
  const [result, setResult] = useState<InferenceResult>();
  const [isProgressPopoverOpen, setIsProgressPopoverOpen] = useState(false);
  const isMobile = useIsMobile();

  // Initialize all inference hooks
  const zeroShotClassification = useInferenceZeroShotClassification(modelId);
  const sentimentAnalysis = useInferenceSentimentAnalysis(modelId);
  const summarizer = useInferenceSummarizer(modelId);
  const text2Text = useInferenceText2Text(modelId);
  const textClassification = useInferenceTextClassification(modelId);
  const tokenClassification = useInferenceTokenClassification(modelId);
  const speechRecognition = useInferenceAutomaticSpeechRecognition(modelId);
  const textGeneration = useInferenceTextGeneration(modelId);

  const infos = selectedModel
    ? getTotalFileInfo(selectedModel.loadFiles)
    : { totalDownloadTime: 0 };

  const hasLoadingFiles =
    selectedModel && Object.keys(selectedModel.loadFiles).length > 0;

  useEffect(() => {
    if (!selectedModel) {
      router.replace(ROUTES.HOME);
    }
  }, [router, selectedModel]);

  // Close popover when loading completes
  useEffect(() => {
    if (!selectedModel?.loading) {
      setIsProgressPopoverOpen(false);
    }
  }, [selectedModel?.loading]);

  // Get the current hook and isPending based on model task
  const getCurrentInferenceHookState = () => {
    switch (selectedModel?.task) {
      case "zero-shot-classification":
        return {
          hook: zeroShotClassification,
          isPending: zeroShotClassification.isPending,
        };
      case "sentiment-analysis":
        return {
          hook: sentimentAnalysis,
          isPending: sentimentAnalysis.isPending,
        };
      case "summarization":
        return { hook: summarizer, isPending: summarizer.isPending };
      case "text2text-generation":
        return { hook: text2Text, isPending: text2Text.isPending };
      case "text-classification":
        return {
          hook: textClassification,
          isPending: textClassification.isPending,
        };
      case "token-classification":
        return {
          hook: tokenClassification,
          isPending: tokenClassification.isPending,
        };
      case "automatic-speech-recognition":
        return {
          hook: speechRecognition,
          isPending: speechRecognition.isPending,
        };
      case "text-generation":
        return { hook: textGeneration, isPending: textGeneration.isPending };
      default:
        return { hook: null, isPending: false };
    }
  };

  const { hook: currentHook, isPending } = getCurrentInferenceHookState();

  const handleInferenceSubmit = async (params: any) => {
    if (!currentHook || !selectedModel) return;
    console.log("Inference params:");
    console.log(params);

    try {
      let inferenceResult: InferenceResult;

      switch (selectedModel.task) {
        case "zero-shot-classification":
          inferenceResult = await zeroShotClassification.classify(
            params as ZeroShotClassificationInputParams
          );
          break;
        case "sentiment-analysis":
          inferenceResult = await sentimentAnalysis.analyze({
            text: params.input,
            options: {
              top_k: params.topK === "null" ? null : Number(params.topK),
            },
          } as SentimentAnalysisInputParams);
          break;
        case "summarization":
          inferenceResult = await summarizer.summarize({
            text: params.input,
          } as SummarizerInputParams);
          break;
        case "text2text-generation":
          inferenceResult = await text2Text.generate({
            text: params.input,
            options:
              params.max_new_tokens && !isNaN(Number(params.max_new_tokens))
                ? {
                    max_new_tokens: Number(params.max_new_tokens),
                  }
                : undefined,
          } as Text2TextGenerationInputParams);
          break;
        case "text-classification":
          inferenceResult = await textClassification.classify({
            text: params.input,
            options: {
              top_k: params.topK === "null" ? null : Number(params.topK),
            },
          } as TextClassificationInputParams);
          break;
        case "token-classification":
          inferenceResult = await tokenClassification.classify(
            params as TokenClassificationInputParams
          );
          break;
        case "automatic-speech-recognition":
          {
            // Handle file vs URL input for speech recognition
            const url =
              params.inputType === "url"
                ? params.audioUrl
                : URL.createObjectURL(params.audioFile);

            try {
              inferenceResult = await speechRecognition.transcribe({
                text: url,
                inputType: params.inputType,
              } as AutomaticSpeechRecognitionInputParams);
            } finally {
              // Always revoke the object URL if it was created from a file
              if (params.inputType === "file") {
                URL.revokeObjectURL(url);
              }
            }
          }
          break;
        case "text-generation":
          inferenceResult = await textGeneration.generate(
            params as TextGenerationInputParams
          );
          break;
        default:
          throw new Error(`Unsupported task: ${selectedModel.task}`);
      }

      if (inferenceResult) {
        setResult(inferenceResult);
      }
    } catch (error) {
      console.error("Inference failed:", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!selectedModel) return;
    try {
      await toggleFavorite(selectedModel.id);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleLoadModel = () => {
    if (!selectedModel) return;
    setModelLoading(selectedModel.id, true);
    loadModel(selectedModel);
  };

  const handleLoadingButtonClick = (e: React.MouseEvent) => {
    // For desktop with tooltip, prevent click during loading
    if (!isMobile && selectedModel?.loading) {
      e.preventDefault();
      return;
    }
    // For non-loading state, proceed with load
    if (!selectedModel?.loading) {
      handleLoadModel();
      // On mobile, automatically open popover when loading starts
      if (isMobile) {
        // Small delay to ensure loading state is set and loadFiles are populated
        setTimeout(() => {
          setIsProgressPopoverOpen(true);
        }, 100);
      }
    }
    // For mobile, click is handled by popover trigger
  };

  if (!selectedModel) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  // Render the appropriate form based on model task
  const renderInferenceForm = () => {
    switch (selectedModel.task) {
      case "zero-shot-classification":
        return (
          <ZeroShotClassificationFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "sentiment-analysis":
        return (
          <SentimentAnalysisFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "summarization":
        return (
          <SummarizeInferenceFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "text2text-generation":
        return (
          <Text2TextGenerationFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "text-classification":
        return (
          <TextClassificationFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "token-classification":
        return (
          <TokenClassificationFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "automatic-speech-recognition":
        return (
          <AutomaticSpeechRecognitionFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      case "text-generation":
        return (
          <TextGenerationFormV2
            modelId={modelId}
            disabled={isPending}
            onInferenceSubmit={handleInferenceSubmit}
          />
        );
      default:
        return (
          <div className="p-4">
            <div className="text-center text-muted-foreground">
              <p>
                Model task &quot;{selectedModel.task}&quot; is not yet supported in V2.
              </p>
            </div>
          </div>
        );
    }
  };

  // Render the appropriate result panel with task type checking
  const renderResultPanel = () => {
    // Pass null to ResultPanel if task doesn't match (components handle null results)
    const resultToPass =
      result && result.task === selectedModel.task ? result : undefined;

    switch (selectedModel.task) {
      case "zero-shot-classification":
        return (
          <ZeroShotClassificationResultPanel
            result={resultToPass as ZeroShotClassificationResult}
            isPending={isPending}
          />
        );
      case "sentiment-analysis":
        return (
          <SentimentAnalysisResultPanel
            result={resultToPass as SentimentAnalysisResult}
            isPending={isPending}
          />
        );
      case "summarization":
        return (
          <SummarizeResultPanel
            result={resultToPass as SummarizerResult}
            isPending={isPending}
          />
        );
      case "text2text-generation":
        return (
          <Text2TextResultPanel
            result={resultToPass as Text2TextGenerationResult}
            isPending={isPending}
          />
        );
      case "text-classification":
        return (
          <TextClassificationResultPanel
            result={resultToPass as TextClassificationResult}
            isPending={isPending}
          />
        );
      case "token-classification":
        return (
          <TokenClassificationResultPanel
            result={resultToPass as TokenClassificationResult}
            isPending={isPending}
          />
        );
      case "automatic-speech-recognition":
        return (
          <AutomaticSpeechRecognitionResultPanel
            result={resultToPass as AutomaticSpeechRecognitionResult}
            isPending={isPending}
          />
        );
      case "text-generation":
        return (
          <TextGenerationResultPanel
            result={resultToPass as TextGenerationResult}
            isPending={isPending}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Model Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{selectedModel.name}</h1>
          <p className="text-muted-foreground text-sm">
            {selectedModel.task
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:flex-shrink-0">
          {!config?.autoLoadModel &&
            !selectedModel.loaded &&
            (selectedModel.loading && hasLoadingFiles ? (
              isMobile ? (
                <Popover
                  open={isProgressPopoverOpen}
                  onOpenChange={setIsProgressPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <AlertCircle size={16} className="text-amber-500" />
                      Loading...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" side="bottom" align="end">
                    <DownloadProgress model={selectedModel} />
                  </PopoverContent>
                </Popover>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleLoadingButtonClick}
                      size="sm"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <AlertCircle size={16} className="text-amber-500" />
                      Loading...
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-80">
                    <DownloadProgress model={selectedModel} />
                  </TooltipContent>
                </Tooltip>
              )
            ) : (
              <Button
                onClick={handleLoadingButtonClick}
                size="sm"
                disabled={selectedModel.loading}
                className="flex items-center gap-2"
              >
                {selectedModel.loading && (
                  <LoaderIcon size={16} className="animate-spin" />
                )}
                {selectedModel.loading ? "Loading..." : "Load Model"}
              </Button>
            ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFavorite}
            className="flex items-center gap-2"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite(selectedModel.id) ? "fill-current text-red-500" : ""
              }`}
            />
            <span className="hidden xs:inline">
              {isFavorite(selectedModel.id) ? "Saved" : "Save"}
            </span>
          </Button>
          <ModelInformation model={selectedModel} />
        </div>
      </div>
      {/* Author Section */}

      {/* Status Section */}
      <div className="space-y-3 md:space-y-0 md:flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge>authored by {selectedModel.metadata?.author}</Badge>
          {selectedModel.loading ? (
            <Badge
              variant="secondary"
              className="bg-amber-50 text-amber-700 border-amber-200"
            >
              <LoaderIcon className="w-3 h-3 mr-1.5 animate-spin" />
              Loading
            </Badge>
          ) : selectedModel.loaded ? (
            <Badge
              variant="secondary"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
              Ready
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              Not Loaded
            </Badge>
          )}
        </div>

        {selectedModel.loaded && (
          <div className="flex items-center gap-2">
            {selectedModel.loadTime && (
              <Badge variant="outline" className="text-xs">
                Load: {formatReadableDurationInMs(selectedModel.loadTime)}
              </Badge>
            )}
            {infos.totalDownloadTime > 0 && (
              <Badge variant="outline" className="text-xs">
                Download: {formatReadableDurationInMs(infos.totalDownloadTime)}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Inference Interface */}
      <div className="space-y-4">
        {renderInferenceForm()}
        {renderResultPanel()}
      </div>
    </div>
  );
};
