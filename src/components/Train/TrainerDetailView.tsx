'use client';

import React from 'react';
import { TrainerConfiguration } from './TrainerConfiguration';
import { TrainerPipelineView } from './TrainerPipelineView';
import { useFetchTrainerDetail } from '@/hooks/trainer';

interface TrainerDetailViewProps {
  trainerId: string;
}

export const TrainerDetailView: React.FC<TrainerDetailViewProps> = ({ trainerId }) => {
  const { data: { data: trainerDetail } = {} , isLoading, error } = useFetchTrainerDetail(trainerId, true);

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
  if (!trainerDetail) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-muted-foreground">Trainer not found</p>
      </div>
    );
  }

  const { activeConfig } = trainerDetail;

  // If there's an active config, show the pipeline view
  if (activeConfig) {
    return <TrainerPipelineView trainerDetail={trainerDetail} />;
  }

  // Otherwise, show the configuration form
  return <TrainerConfiguration trainerId={trainerId} />;
};
