'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export interface BudgetTargetData {
  targetAccuracy: number;
  targetPrecision: number;
  targetRecall: number;
  targetF1Score: number;
  maxBudget: number;
  alertAtBudgetUsage: number;
}

interface BudgetTargetFormProps {
  onBack: () => void;
  onSave: (data: BudgetTargetData) => void;
  initialData?: BudgetTargetData;
}

export const BudgetTargetForm: React.FC<BudgetTargetFormProps> = ({
  onBack,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<BudgetTargetData>(
    initialData || {
      targetAccuracy: 0,
      targetPrecision: 0,
      targetRecall: 0,
      targetF1Score: 0,
      maxBudget: 0,
      alertAtBudgetUsage: 80,
    }
  );

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Budget & Target Configuration</h2>
          <p className="text-sm text-muted-foreground">Set target metrics and budget limits</p>
        </div>
      </div>

      {/* Expected Metrics Output */}
      <Card>
        <CardHeader>
          <CardTitle>Expected Metrics Output</CardTitle>
          <CardDescription>Set target metrics for model performance</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Target Accuracy (%)</Label>
            <Input
              type="number"
              placeholder="e.g., 95"
              min="0"
              max="100"
              value={formData.targetAccuracy || ''}
              onChange={(e) =>
                setFormData({ ...formData, targetAccuracy: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Target Precision (%)</Label>
            <Input
              type="number"
              placeholder="e.g., 90"
              min="0"
              max="100"
              value={formData.targetPrecision || ''}
              onChange={(e) =>
                setFormData({ ...formData, targetPrecision: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Target Recall (%)</Label>
            <Input
              type="number"
              placeholder="e.g., 90"
              min="0"
              max="100"
              value={formData.targetRecall || ''}
              onChange={(e) =>
                setFormData({ ...formData, targetRecall: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Target F1 Score (%)</Label>
            <Input
              type="number"
              placeholder="e.g., 92"
              min="0"
              max="100"
              value={formData.targetF1Score || ''}
              onChange={(e) =>
                setFormData({ ...formData, targetF1Score: Number(e.target.value) })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Trainer Budget Limit */}
      <Card>
        <CardHeader>
          <CardTitle>Trainer Budget Limit</CardTitle>
          <CardDescription>Training will automatically stop when budget limit is reached</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Maximum Budget ($)</Label>
            <Input
              type="number"
              placeholder="e.g., 100"
              min="0"
              step="0.01"
              value={formData.maxBudget || ''}
              onChange={(e) =>
                setFormData({ ...formData, maxBudget: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Alert at Budget Usage (%)</Label>
            <Input
              type="number"
              placeholder="e.g., 80"
              min="0"
              max="100"
              value={formData.alertAtBudgetUsage || ''}
              onChange={(e) =>
                setFormData({ ...formData, alertAtBudgetUsage: Number(e.target.value) })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onBack}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};
