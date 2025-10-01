'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';

const datasetEvaluationSchema = z.object({
  datasetFile: z.instanceof(File).nullable().refine((file) => file !== null, {
    message: "Dataset file is required",
  }),
  datasetFileName: z.string().min(1, "Dataset file is required"),
  exampleCount: z.coerce.number().min(150, "Minimum 150 evaluation examples required"),
});

export type DatasetEvaluationData = z.infer<typeof datasetEvaluationSchema>;

interface DatasetEvaluationFormProps {
  onBack: () => void;
  onSave: (data: DatasetEvaluationData) => void;
  initialData?: DatasetEvaluationData;
}

export const DatasetEvaluationForm: React.FC<DatasetEvaluationFormProps> = ({
  onBack,
  onSave,
  initialData
}) => {
  const formInstance = useForm<DatasetEvaluationData>({
    defaultValues: initialData || {
      datasetFile: null,
      datasetFileName: '',
      exampleCount: 0,
    },
    resolver: zodResolver(datasetEvaluationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    formInstance.setValue('datasetFile', file);
    formInstance.setValue('datasetFileName', file?.name || '');
    // TODO: Parse file to get actual example count
    formInstance.setValue('exampleCount', 0);
  };

  const handleSubmit = formInstance.handleSubmit((data) => {
    onSave(data);
  });

  const datasetFileName = formInstance.watch('datasetFileName');
  const exampleCount = formInstance.watch('exampleCount');

  return (
    <Form {...formInstance}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mt-4">
          <Button type="button" variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Dataset Evaluation Configuration</h2>
            <p className="text-sm text-muted-foreground">Upload your custom evaluation dataset</p>
          </div>
        </div>

        {/* Human Verification Evaluation Set */}
        <div className="space-y-3 mt-4">
          <h3 className="text-base font-semibold">Evaluation Dataset</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Dataset file (CSV, JSON, JSONL) - minimum 150 examples</Label>
              <Input
                type="file"
                accept=".csv,.json,.jsonl"
                onChange={handleFileChange}
              />
              {datasetFileName && (
                <p className="text-sm font-medium">Selected: {datasetFileName}</p>
              )}
              {formInstance.formState.errors.datasetFile && (
                <p className="text-sm text-destructive">
                  {formInstance.formState.errors.datasetFile.message}
                </p>
              )}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Examples: </span>
              <span className={`font-medium ${exampleCount >= 150 ? 'text-green-600' : 'text-orange-600'}`}>
                {exampleCount} / 150 minimum
              </span>
              {formInstance.formState.errors.exampleCount && (
                <p className="text-sm text-destructive">
                  {formInstance.formState.errors.exampleCount.message}
                </p>
              )}
            </div>
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
