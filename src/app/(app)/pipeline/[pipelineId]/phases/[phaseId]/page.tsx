"use client";

import { PipelinePhaseParams } from "@/constants/routes";
import { useFetchPhase } from "@/hooks/pipeline/phase/useFetchPhase";
import { useFetchPipeline } from "@/hooks/pipeline/useFetchPipeline";
import { useFetchPipelineTestSet } from "@/hooks/pipeline/useFetchPipelineTestset";
import { useContinueGeneration } from "@/hooks/pipeline/phase/useContinueGeneration";
import { useParams } from "next/navigation";
import {
  PhaseDetailCard,
  TrainingPool,
} from "@/components/pipeline/PhaseDetailView";
import { DatasetView } from "@/components/pipeline/DatasetView";
import { LabelInfoDialog } from "@/components/pipeline/LabelInfoDialog/LabelInfoDialog";
import { ProfileListView } from "@/components/training-profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tags, TestTube, Play, Settings2 } from "lucide-react";
import { useState } from "react";

export default function PipelinePhasePage() {
  const { pipelineId, phaseId } = useParams<PipelinePhaseParams>();
  const { data: { data: pipelineDetail } = {} } = useFetchPipeline(pipelineId);
  const { data: { data: phaseDetail } = {}, refetch: refetchParentPhase } = useFetchPhase(phaseId);
  const { data: { data: testsetDetail } = {} } =
    useFetchPipelineTestSet(pipelineId);

  const [showTestDataset, setShowTestDataset] = useState(false);
  const [showTrainingProfiles, setShowTrainingProfiles] = useState(false);
  const continueGeneration = useContinueGeneration();

  if (!phaseDetail) {
    return (
      <div className="space-y-4 pb-10">
        <h1 className="mt-4 text-2xl font-bold">
          {pipelineDetail?.name || "Unnamed Pipeline"}
        </h1>
        <div className="border rounded-lg bg-white p-8 text-center text-muted-foreground">
          Loading phase details...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
        <h1 className="text-2xl font-bold">
          {pipelineDetail?.name || "Unnamed Pipeline"}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {/* Label Config Dialog */}
          {pipelineDetail?.label_config && (
            <LabelInfoDialog
              labelConfig={pipelineDetail.label_config}
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <Tags className="w-4 h-4" />
                  Label Config
                </Button>
              }
            />
          )}

          {/* Test Dataset Dialog */}
          {testsetDetail?.samples && testsetDetail.samples.length > 0 && (
            <Dialog open={showTestDataset} onOpenChange={setShowTestDataset}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <TestTube className="w-4 h-4" />
                  Test Dataset
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[95vw] md:!max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>Test Dataset</DialogTitle>
                  <DialogDescription>
                    View and search through test dataset samples
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-2">
                  <DatasetView
                    samples={testsetDetail.samples}
                    labelConfig={pipelineDetail?.label_config?.id2label}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Training Profiles Dialog */}
          <Dialog open={showTrainingProfiles} onOpenChange={setShowTrainingProfiles}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings2 className="w-4 h-4" />
                Training Profiles
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-[95vw] md:!max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Training Profiles</DialogTitle>
                <DialogDescription>
                  Manage training and LoRA configuration profiles
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto pr-2">
                <ProfileListView />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Global: Training Pool */}
      <TrainingPool
        phaseId={phaseId}
        composalDatasets={phaseDetail.composal_datasets}
        labelConfig={pipelineDetail?.label_config?.id2label}
      />

      {/* Parent Phase Details */}
      <PhaseDetailCard
        ignoreRefetch={true}
        phaseId={phaseId}
        labelConfig={pipelineDetail?.label_config?.id2label}
      />

      {/* Child Phases */}
      {phaseDetail.child_phases &&
        phaseDetail.child_phases.length > 0 &&
        phaseDetail.child_phases.map((childPhase) => (
          <PhaseDetailCard
            key={childPhase.id}
            phaseId={childPhase.id}
            labelConfig={pipelineDetail?.label_config.id2label}
            ignoreRefetch={false}
            phaseNumber={childPhase.phase_number}
          />
        ))}

      {/* Run New Phase Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="default"
          size="lg"
          className="gap-2"
          onClick={() => {
            // Get the latest previous phase - either the last child phase or the current phase
            const latestPhaseId =
              phaseDetail.child_phases && phaseDetail.child_phases.length > 0
                ? phaseDetail.child_phases[phaseDetail.child_phases.length - 1].id
                : phaseId;

            continueGeneration.mutate({ phaseId: latestPhaseId });
            setTimeout(() => {
              refetchParentPhase()
            }, 2000)
          }}
          disabled={continueGeneration.isPending}
        >
          <Play className="w-4 h-4" />
          {continueGeneration.isPending ? "Starting..." : "Run New Phase"}
        </Button>
      </div>
    </div>
  );
}
