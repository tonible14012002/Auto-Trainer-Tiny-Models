'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/common/Form/FormInput';

const budgetTargetSchema = z.object({
  targetAccuracy: z.coerce.number().min(0, "Must be at least 0").max(100, "Must be at most 100"),
  targetPrecision: z.coerce.number().min(0, "Must be at least 0").max(100, "Must be at most 100"),
  targetRecall: z.coerce.number().min(0, "Must be at least 0").max(100, "Must be at most 100"),
  targetF1Score: z.coerce.number().min(0, "Must be at least 0").max(100, "Must be at most 100"),
  maxBudget: z.coerce.number().min(0, "Must be at least 0"),
  alertAtBudgetUsage: z.coerce.number().min(0, "Must be at least 0").max(100, "Must be at most 100"),
});

export type BudgetTargetData = z.infer<typeof budgetTargetSchema>;

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
  const formInstance = useForm<BudgetTargetData>({
    defaultValues: initialData || {
      targetAccuracy: 0,
      targetPrecision: 0,
      targetRecall: 0,
      targetF1Score: 0,
      maxBudget: 0,
      alertAtBudgetUsage: 80,
    },
    resolver: zodResolver(budgetTargetSchema),
  });

  const handleSubmit = formInstance.handleSubmit((data) => {
    onSave(data);
  });

  return (
    <Form {...formInstance}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mt-4">
          <Button type="button" variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Budget & Target Configuration</h2>
            <p className="text-sm text-muted-foreground">Set target metrics and budget limits</p>
          </div>
        </div>

        {/* Expected Metrics Output */}
        <div className="space-y-3 mt-4">
          <h3 className="text-base font-semibold">Target Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="targetAccuracy"
              label="Accuracy target (%)"
              type="number"
              placeholder="e.g., 95"
              min={0}
              max={100}
            />
            <FormInput
              name="targetPrecision"
              label="Precision target (%)"
              type="number"
              placeholder="e.g., 90"
              min={0}
              max={100}
            />
            <FormInput
              name="targetRecall"
              label="Recall target (%)"
              type="number"
              placeholder="e.g., 90"
              min={0}
              max={100}
            />
            <FormInput
              name="targetF1Score"
              label="F1 score target (%)"
              type="number"
              placeholder="e.g., 92"
              min={0}
              max={100}
            />
          </div>
        </div>

        {/* Trainer Budget Limit */}
        <div className="space-y-3 mt-4">
          <h3 className="text-base font-semibold">Budget Limits</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              name="maxBudget"
              label="Maximum training budget ($)"
              type="number"
              placeholder="e.g., 100"
              min={0}
              step={0.01}
            />
            <FormInput
              name="alertAtBudgetUsage"
              label="Alert threshold (%)"
              type="number"
              placeholder="e.g., 80"
              min={0}
              max={100}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onBack}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};
