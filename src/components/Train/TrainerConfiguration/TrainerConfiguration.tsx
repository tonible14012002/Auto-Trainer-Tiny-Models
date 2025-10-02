'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, ChevronRight, FileText, Target, Database } from 'lucide-react';
import { useFetchTrainers } from '@/hooks/trainer/useFetchTrainers';
import { TaskDefinitionForm, TaskDefinitionData } from './TaskDefinitionForm';
import { BudgetTargetForm, BudgetTargetData } from './BudgetTargetForm';
import { DatasetEvaluationForm, DatasetEvaluationData } from './DatasetEvaluationForm';

interface TrainerConfigurationProps {
  trainerId: string;
}

type ConfigSection = 'list' | 'task-definition' | 'budget-target' | 'dataset-evaluation';

interface ConfigurationData {
  taskDefinition?: TaskDefinitionData;
  budgetTarget?: BudgetTargetData;
  datasetEvaluation?: DatasetEvaluationData;
}

export const TrainerConfiguration: React.FC<TrainerConfigurationProps> = ({ trainerId }) => {
  const { data } = useFetchTrainers();
  const [currentSection, setCurrentSection] = useState<ConfigSection>('list');
  const [configData, setConfigData] = useState<ConfigurationData>({});

  const trainerName = useMemo(() => {
    if (!data?.data || !trainerId) return 'Trainer Configuration';

    const trainer = data.data.find(t => t.id === Number(trainerId));
    return trainer?.name || 'Trainer Configuration';
  }, [data?.data, trainerId]);

  const sections = [
    {
      id: 'task-definition' as ConfigSection,
      title: 'Task Definition',
      description: 'Define task type, model purpose, and labels',
      icon: FileText,
      completed: !!configData.taskDefinition,
      optional: false,
    },
    {
      id: 'budget-target' as ConfigSection,
      title: 'Budget & Target Configuration',
      description: 'Set target metrics and budget limits',
      icon: Target,
      completed: !!configData.budgetTarget,
      optional: false,
    },
    {
      id: 'dataset-evaluation' as ConfigSection,
      title: 'Dataset Evaluation Configuration',
      description: 'Upload custom evaluation dataset (optional - can be added later)',
      icon: Database,
      completed: !!configData.datasetEvaluation,
      optional: true,
    },
  ];

  const handleSaveTaskDefinition = (data: TaskDefinitionData) => {
    setConfigData({ ...configData, taskDefinition: data });
    setCurrentSection('list');
  };

  const handleSaveBudgetTarget = (data: BudgetTargetData) => {
    setConfigData({ ...configData, budgetTarget: data });
    setCurrentSection('list');
  };

  const handleSaveDatasetEvaluation = (data: DatasetEvaluationData) => {
    setConfigData({ ...configData, datasetEvaluation: data });
    setCurrentSection('list');
  };

  const handleStartTraining = () => {
    // TODO: Submit configuration and start training
    console.log('Starting training with config:', configData);
  };

  const allSectionsCompleted = sections.filter(s => !s.optional).every(s => s.completed);

  // Render current section
  if (currentSection !== 'list') {
    return (
      <>
        {currentSection === 'task-definition' && (
          <TaskDefinitionForm
            onBack={() => setCurrentSection('list')}
            onSave={handleSaveTaskDefinition}
            initialData={configData.taskDefinition}
          />
        )}
        {currentSection === 'budget-target' && (
          <BudgetTargetForm
            onBack={() => setCurrentSection('list')}
            onSave={handleSaveBudgetTarget}
            initialData={configData.budgetTarget}
          />
        )}
        {currentSection === 'dataset-evaluation' && (
          <DatasetEvaluationForm
            onBack={() => setCurrentSection('list')}
            onSave={handleSaveDatasetEvaluation}
            initialData={configData.datasetEvaluation}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header with Configuration State Indicator */}
      <div className="space-y-3 mt-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{trainerName}</h1>
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1.5"
          >
            <Settings className="w-3 h-3" />
            Configuration
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">Configure your model training settings</p>
      </div>

      {/* Configuration Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.id}
              className={`cursor-pointer shadow-none hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors ${
                section.completed
                  ? 'border-green-500 bg-green-50/50'
                  : ''
              }`}
              onClick={() => setCurrentSection(section.id)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setCurrentSection(section.id);
                }
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                      section.completed ? 'bg-green-100' : 'bg-primary/10'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        section.completed ? 'text-green-600' : 'text-primary'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {section.title}
                        {section.optional && (
                          <Badge variant="outline" className="text-xs font-normal">
                            Optional
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Save as Draft</Button>
        <Button
          onClick={handleStartTraining}
          disabled={!allSectionsCompleted}
        >
          Start Training
        </Button>
      </div>
    </div>
  );
};
