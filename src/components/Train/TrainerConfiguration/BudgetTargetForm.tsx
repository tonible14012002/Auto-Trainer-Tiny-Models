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
  maxBudget: z.coerce.number().min(0.01, "Budget must be greater than 0"),
  alertAtBudgetUsage: z.coerce.number().min(1, "Must be at least 1").max(100, "Must be at most 100"),
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
      maxBudget: 10,
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
            <h2 className="text-xl font-semibold">Budget Configuration</h2>
            <p className="text-sm text-muted-foreground">Set your training budget and alert preferences</p>
          </div>
        </div>

        {/* Budget Settings */}
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <FormInput
              name="maxBudget"
              label="Maximum Training Budget ($)"
              type="number"
              placeholder="e.g., 10"
              min={0.01}
              step={0.01}
              description="Set the maximum amount you want to spend on training this model"
            />
          </div>
          <div className="space-y-2">
            <FormInput
              name="alertAtBudgetUsage"
              label="Alert Threshold (%)"
              type="number"
              placeholder="e.g., 80"
              min={1}
              max={100}
              description="Get notified when your training costs reach this percentage of your budget"
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
