'use client';

import React from 'react';
import { TrainerPipelineView } from './TrainerPipelineView';
import { useFetchPipeline } from '@/hooks/pipeline/useFetchPipeline';

interface TrainerDetailViewProps {
  pipelineId: string;
}

export const TrainerDetailView: React.FC<TrainerDetailViewProps> = ({ pipelineId }) => {
  const { data: { data: pipelineDetail } = {} , isLoading, error } = useFetchPipeline(pipelineId);

  // Show loading state
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
        <p className="text-destructive">Error loading trainer: {error.message}</p>
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

  return <TrainerPipelineView pipelineDetail={pipelineDetail} />;
};
