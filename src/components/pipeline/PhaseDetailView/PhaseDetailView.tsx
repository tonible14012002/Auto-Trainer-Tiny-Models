"use client";

import { useState } from "react";
import { PhaseDetail } from "@/schema/schema_v2";
import { Database, Brain, BarChart3 } from "lucide-react";
import { PhaseHeader } from "./PhaseHeader";
import { CollapsibleSection } from "./CollapsibleSection";
import { GenerationSection } from "./GenerationSection";
import { TrainingSection } from "./TrainingSection";
import { EvaluationSection } from "./EvaluationSection";

interface PhaseDetailViewProps {
  phase: PhaseDetail;
  labelConfig?: Record<string, string>;
}

export const PhaseDetailView = ({ phase, labelConfig }: PhaseDetailViewProps) => {
  const [isGenerationOpen, setIsGenerationOpen] = useState(true);
  const [isTrainingOpen, setIsTrainingOpen] = useState(true);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(true);

  const getDatasetBadge = () => {
    const count = (phase.composal_datasets?.length || 0) + (phase.dataset_files?.length || 0);
    return count > 0
      ? `${count} item${count !== 1 ? "s" : ""}`
      : undefined;
  };

  const getModelBadge = () => {
    const count = phase.trained_models?.length || 0;
    return count > 0
      ? `${count} model${count !== 1 ? "s" : ""}`
      : undefined;
  };

  return (
    <div className="space-y-6">
      <PhaseHeader phase={phase} />

      {/* Generation Section */}
      <CollapsibleSection
        title="Generation"
        description="Composal datasets and dataset files"
        icon={Database}
        iconColor="text-blue-600"
        isOpen={isGenerationOpen}
        onToggle={() => setIsGenerationOpen(!isGenerationOpen)}
        badge={getDatasetBadge()}
      >
        <GenerationSection
          composalDatasets={phase.composal_datasets}
          datasetFiles={phase.dataset_files}
        />
      </CollapsibleSection>

      {/* Training Section */}
      <CollapsibleSection
        title="Training"
        description="Trained models and configurations"
        icon={Brain}
        iconColor="text-purple-600"
        isOpen={isTrainingOpen}
        onToggle={() => setIsTrainingOpen(!isTrainingOpen)}
        badge={getModelBadge()}
      >
        <TrainingSection trainedModels={phase.trained_models} />
      </CollapsibleSection>

      {/* Evaluation Section */}
      <CollapsibleSection
        title="Evaluation"
        description="Model performance metrics and results"
        icon={BarChart3}
        iconColor="text-green-600"
        isOpen={isEvaluationOpen}
        onToggle={() => setIsEvaluationOpen(!isEvaluationOpen)}
      >
        <EvaluationSection
          trainedModels={phase.trained_models}
          labelConfig={labelConfig}
        />
      </CollapsibleSection>
    </div>
  );
};
