"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DownloadIcon, LoaderIcon, TrashIcon } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { ModelInferenceTab } from "./ModelInferenceTab";
import { useWorkerContext } from "@/provider/ModelWorkerProvider";
import { toast } from "sonner";
import { DTYPE_OPTIONS, MODEL_RECOMMENDED_DTYPES } from "@/constants/model";
import type { DType } from "@/schema/model";
import { useModels } from "@/provider/ModelsProvider";
import { cn } from "@/lib/utils";
import { ModelInfoCard } from "./ModelInfoCard";
import { ModelMetadataCard } from "./ModelMetadataCard";
import { getTotalFileInfo } from "@/utils/model";
import {
  formatReadableDurationInMs,
  formatReadableFileSize,
} from "@/utils/format";
import { ModelFileLoadBoard } from "./ModelFileLoadBoard";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelInferenceViewProps {
  selectedModelId: string;
}

const MODES = {
  FINETUNING: "fine-tuning",
  INFERENCE: "inference",
};
type ModeType = (typeof MODES)[keyof typeof MODES];

export const ModelInferenceView = memo(
  ({ selectedModelId }: ModelInferenceViewProps) => {
    const { models, setModelLoading, setModels } = useModels();
    const { loadModel } = useWorkerContext();
    const [mode, setMode] = useState<ModeType>(MODES.INFERENCE);

    const model = useMemo(
      () => models.find((m) => m.id === selectedModelId)!, // truth
      [models, selectedModelId]
    );

    // Get recommended dtype for this model
    const recommendedDtype = model
      ? MODEL_RECOMMENDED_DTYPES[model.modelPath]
      : "auto";

    const dTypeValue = model.dtype || recommendedDtype || "auto";
    const setDTypeValue = (value: DType) => {
      if (!model) return;
      setModels((prev) =>
        prev.map((m) => (m.id === model.id ? { ...m, dtype: value } : m))
      );
    };

    const isLoadingModel = model?.loading || false;

    const onLoadModelBtn = () => {
      if (!model) return;
      setModelLoading(model.id, true);
      loadModel(model);
    };

    const handleExport = () => {
      console.log("Exporting model...");
      toast.warning("Model Exporting is not supported yet");
    };

    if (!model) {
      return null;
    }

    const infos = getTotalFileInfo(model.loadFiles || {});

    return (
      <div
        className={cn(
          "h-full w-full p-4 flex flex-col overflow-y-auto md:overflow-hiddens"
        )}
      >
        <div className="">
          <h1 className="text-3xl font-bold">{model.name}</h1>
          <p className="text-muted-foreground">{model.task}</p>
        </div>
        <Tabs value={mode} onValueChange={setMode} className="flex-1 min-h-0">
          <div className="flex justify-between gap-x-4 mt-4 flex-col-reverse lg:flex-row gap-y-4">
            <TabsList>
              <TabsTrigger value={MODES.INFERENCE}>Inference Mode</TabsTrigger>
              <TabsTrigger disabled value={MODES.FINETUNING}>
                Fine Tuning Mode
              </TabsTrigger>
            </TabsList>
            <div className="flex md:items-center items-start gap-2 md:flex-row flex-col">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">DType:</label>
                <Select
                  disabled={isLoadingModel || Boolean(model.loaded)}
                  value={dTypeValue}
                  onValueChange={(value) => {
                    setDTypeValue(value as DType);
                  }}
                >
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DTYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                        {recommendedDtype === option.value && (
                          <span className="text-xs text-muted-foreground ml-1">
                            (recommended)
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={onLoadModelBtn}
                  size="sm"
                  disabled={Boolean(model.loaded) || isLoadingModel}
                >
                  {isLoadingModel && (
                    <LoaderIcon size={12} className="animate-spin" />
                  )}
                  Load Model
                </Button>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <DownloadIcon />
                  Export
                </Button>
                <Button size="sm" className="w-8 h-8" variant="destructive">
                  <TrashIcon />
                </Button>
              </div>
            </div>
          </div>
          <div
            className={cn("md:overflow-y-auto  flex-1 pt-4 pb-8 -mx-4 px-4")}
          >
            {/* Model Metadata Section */}
            <div className="w-full mb-6">
              <ModelMetadataCard model={model} />
            </div>

            {/* Model Information Cards */}
            <div className="w-full grid lg:grid-cols-2 gap-4 mb-4">
              <ModelInfoCard
                title="Basic Information"
                infos={[
                  { label: "Name", value: model.name, type: "text" },
                  { label: "Task", value: model.task, type: "text" },
                  {
                    label: "Status",
                    value: model.loaded ? (
                      <Badge>Loaded</Badge>
                    ) : (
                      <Badge variant="destructive">Not loaded</Badge>
                    ),
                    type: "text",
                  },
                  {
                    type: "react-node",
                    node: (
                      <div
                        className="border -mx-1.5 px-1.5 py-1 rounded-md min-h-[40px] flex-1 text-xs"
                        key="config"
                      >
                        <div className="mb-1">Additional Config</div>
                        <span className="text-accent-foreground/70">
                          {JSON.stringify(model.config || {}, null, 2)}
                        </span>
                      </div>
                    ),
                  },
                ]}
              />
              <ModelInfoCard
                title="Load Information"
                infos={[
                  {
                    type: "react-node",
                    node: (
                      <ModelFileLoadBoard
                        loadFileStatus={model.loadFiles}
                        key="fileload"
                      />
                    ),
                  },
                  {
                    type: "react-node",
                    node: <hr key="hr" />,
                  },
                  {
                    type: "text",
                    label: "Total download time",
                    value: formatReadableDurationInMs(infos.totalDownloadTime),
                  },
                  {
                    type: "text",
                    label: "Load time",
                    value: formatReadableDurationInMs(model.loadTime),
                  },
                  {
                    type: "text",
                    label: "Total File Size",
                    value:
                      formatReadableFileSize(infos.loadedSize) +
                      " / " +
                      formatReadableFileSize(infos.totalSize),
                  },
                ]}
              />
            </div>
            <TabsContent value={MODES.INFERENCE}>
              <ModelInferenceTab model={model} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  }
);

ModelInferenceView.displayName = "ModelInferenceView";
