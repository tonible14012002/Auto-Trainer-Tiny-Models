"use client";

import { PipelineDetailView } from "@/components/pipeline/PipelineDetailView";
import { PipelineParams } from "@/constants/routes";
import { useFetchPipeline } from "@/hooks/pipeline/useFetchPipeline";
import { useParams } from "next/navigation";

export default function PipelineDetailPage() {
  const { pipelineId } = useParams<PipelineParams>();

  const {
    data: { data: pipelineDetail } = {},
    isLoading,
    error,
    refetch,
  } = useFetchPipeline(pipelineId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-muted-foreground">Loading trainer details...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-destructive">
          Error loading trainer: {error.message}
        </p>
      </div>
    );
  }

  // No data
  if (!pipelineDetail) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-muted-foreground">Trainer not found</p>
      </div>
    );
  }

  return <PipelineDetailView pipelineDetail={pipelineDetail} refetch={refetch} />
};

