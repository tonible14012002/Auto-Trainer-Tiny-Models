'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export interface DatasetEvaluationData {
  datasetFile: File | null;
  datasetFileName: string;
  exampleCount: number;
}

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
  const [formData, setFormData] = useState<DatasetEvaluationData>(
    initialData || {
      datasetFile: null,
      datasetFileName: '',
      exampleCount: 0,
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      datasetFile: file,
      datasetFileName: file?.name || '',
      // TODO: Parse file to get actual example count
      exampleCount: 0,
    });
  };

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
          <h2 className="text-xl font-semibold">Dataset Evaluation Configuration</h2>
          <p className="text-sm text-muted-foreground">Upload your custom evaluation dataset</p>
        </div>
      </div>

      {/* Human Verification Evaluation Set */}
      <Card>
        <CardHeader>
          <CardTitle>Human Verification Evaluation Set</CardTitle>
          <CardDescription>Minimum 150 evaluation examples required</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Upload Evaluation Dataset</Label>
            <Input
              type="file"
              accept=".csv,.json,.jsonl"
              onChange={handleFileChange}
            />
            <p className="text-sm text-muted-foreground">Supported formats: CSV, JSON, JSONL</p>
            {formData.datasetFileName && (
              <p className="text-sm font-medium">Selected: {formData.datasetFileName}</p>
            )}
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Current examples: </span>
            <span className={`font-medium ${formData.exampleCount >= 150 ? 'text-green-600' : 'text-orange-600'}`}>
              {formData.exampleCount} / 150 minimum
            </span>
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
