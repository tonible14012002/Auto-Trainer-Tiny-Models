'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

export interface TaskDefinitionData {
  taskType: string;
  modelPurpose: string;
  dataType: string;
  labels: Array<{
    name: string;
    explanation: string;
    examples: string;
  }>;
  includeOOS: boolean;
}

interface TaskDefinitionFormProps {
  onBack: () => void;
  onSave: (data: TaskDefinitionData) => void;
  initialData?: TaskDefinitionData;
}

export const TaskDefinitionForm: React.FC<TaskDefinitionFormProps> = ({
  onBack,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<TaskDefinitionData>(
    initialData || {
      taskType: 'text-classification',
      modelPurpose: '',
      dataType: '',
      labels: [{ name: '', explanation: '', examples: '' }],
      includeOOS: false,
    }
  );

  const handleAddLabel = () => {
    setFormData({
      ...formData,
      labels: [...formData.labels, { name: '', explanation: '', examples: '' }],
    });
  };

  const handleRemoveLabel = (index: number) => {
    const newLabels = formData.labels.filter((_, i) => i !== index);
    setFormData({ ...formData, labels: newLabels });
  };

  const handleLabelChange = (index: number, field: string, value: string) => {
    const newLabels = [...formData.labels];
    newLabels[index] = { ...newLabels[index], [field]: value };
    setFormData({ ...formData, labels: newLabels });
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
          <h2 className="text-xl font-semibold">Task Definition</h2>
          <p className="text-sm text-muted-foreground">Define the task type, model purpose, and labels</p>
        </div>
      </div>

      {/* Task Type */}
      <Card>
        <CardHeader>
          <CardTitle>Task Type</CardTitle>
          <CardDescription>Select the type of task for this trainer</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            disabled
            value={formData.taskType}
            onValueChange={(value) => setFormData({ ...formData, taskType: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-classification">Text Classification</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Model Description */}
      <Card>
        <CardHeader>
          <CardTitle>Model Description</CardTitle>
          <CardDescription>Describe the purpose and data for this model</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>What is it used for?</Label>
            <Textarea
              placeholder="Describe the purpose of this model..."
              rows={3}
              value={formData.modelPurpose}
              onChange={(e) => setFormData({ ...formData, modelPurpose: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Which kind of data it will be run on?</Label>
            <Textarea
              placeholder="Describe the type of data this model will process..."
              rows={3}
              value={formData.dataType}
              onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Label Declaration */}
      <Card>
        <CardHeader>
          <CardTitle>Label Declaration</CardTitle>
          <CardDescription>Define labels with explanations and examples</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {formData.labels.map((label, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <Input
                    placeholder="Label name"
                    className="flex-1"
                    value={label.name}
                    onChange={(e) => handleLabelChange(index, 'name', e.target.value)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveLabel(index)}
                    disabled={formData.labels.length === 1}
                  >
                    Remove
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Explanation</Label>
                  <Textarea
                    placeholder="Explain what this label means..."
                    rows={2}
                    value={label.explanation}
                    onChange={(e) => handleLabelChange(index, 'explanation', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Few-shot Examples</Label>
                  <Textarea
                    placeholder="Provide examples of data for this label..."
                    rows={3}
                    value={label.examples}
                    onChange={(e) => handleLabelChange(index, 'examples', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full" onClick={handleAddLabel}>
            Add New Label
          </Button>

          <Separator />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="oos-toggle"
              checked={formData.includeOOS}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, includeOOS: checked === true })
              }
            />
            <Label htmlFor="oos-toggle" className="cursor-pointer">
              Should it run on OOS (Out of distribution) - open intent text?
            </Label>
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
