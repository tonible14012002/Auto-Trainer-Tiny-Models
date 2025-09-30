"use client";

import { memo } from "react";
import type { ModelDetail } from "@/schema/model";
import { ModelItem } from "./ModelItem";

interface ModelListProps {
  modelDetails: ModelDetail[];
  onSelectModel: (modelId: string) => void;
  selectedModelId?: string;
}

export const ModelList = memo((props: ModelListProps) => {
  const { modelDetails, onSelectModel, selectedModelId } = props;

  return (
    <div className="flex flex-col gap-2">
      {modelDetails.map((model) => (
        <ModelItem
          key={model.id}
          modelDetail={model}
          onSelect={onSelectModel}
          isSelected={selectedModelId === model.id}
        />
      ))}
    </div>
  );
});

ModelList.displayName = "ModelList";
