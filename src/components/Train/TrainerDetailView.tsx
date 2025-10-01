'use client';

import React, { useState } from 'react';
import { TrainerConfiguration } from './TrainerConfiguration/TrainerConfiguration';

interface TrainerDetailViewProps {
  trainerId: string;
}

type TrainerState = 'configuring' | 'running';

export const TrainerDetailView: React.FC<TrainerDetailViewProps> = ({ trainerId }) => {
  // TODO: Fetch trainer state from API/store
  const [trainerState, _] = useState<TrainerState>('configuring');

  // Determine which view to render based on trainer state
  const renderContent = () => {
    switch (trainerState) {
      case 'configuring':
        return <TrainerConfiguration trainerId={trainerId} />;
      case 'running':
        // TODO: Implement running state view
        return (
          <div className="flex items-center justify-center h-full p-6">
            <p className="text-muted-foreground">Running state view - Coming soon</p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="h-full">{renderContent()}</div>;
};
