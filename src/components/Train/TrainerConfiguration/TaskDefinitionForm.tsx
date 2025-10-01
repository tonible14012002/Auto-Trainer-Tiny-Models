'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { FormTextArea } from '@/components/common/Form/FormTextArea';
import { Input } from '@/components/ui/input';

const labelSchema = z.object({
  name: z.string().min(1, "Label name is required"),
  explanation: z.string().min(1, "Explanation is required"),
  examples: z.string().min(1, "Examples are required"),
});

const taskDefinitionSchema = z.object({
  taskType: z.string(),
  modelPurpose: z.string().min(1, "Model purpose is required"),
  dataType: z.string().min(1, "Data type description is required"),
  labels: z.array(labelSchema).min(1, "At least one label is required"),
  includeOOS: z.boolean(),
});

export type TaskDefinitionData = z.infer<typeof taskDefinitionSchema>;

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
  const formInstance = useForm<TaskDefinitionData>({
    defaultValues: initialData || {
      taskType: 'text-classification',
      modelPurpose: '',
      dataType: '',
      labels: [{ name: '', explanation: '', examples: '' }],
      includeOOS: false,
    },
    resolver: zodResolver(taskDefinitionSchema),
  });

  console.log(formInstance.formState.errors)

  const { fields, append, remove } = useFieldArray({
    control: formInstance.control,
    name: 'labels',
  });

  const handleAddLabel = () => {
    append({ name: '', explanation: '', examples: '' });
  };

  const handleRemoveLabel = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

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
            <h2 className="text-xl font-semibold">Task Definition</h2>
          </div>
        </div>

        {/* Task Type */}
        <div className="space-y-3 mt-4">
          <h3 className="text-base font-semibold">Task Type</h3>
          <Select
            disabled
            value={formInstance.watch('taskType')}
            onValueChange={(value) => formInstance.setValue('taskType', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-classification">Text Classification</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Model Description */}
        <div className="space-y-4 mt-4">
          <FormTextArea
            name="modelPurpose"
            label="Model Purpose"
            placeholder="Detect if a given user message having a payment intent or not..."
            rows={3}
          />
          <FormTextArea
            name="dataType"
            label="Input Data Type"
            placeholder="User messages in plain text format, typically conversational queries..."
            rows={3}
          />
        </div>

        {/* Label Declaration */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Label Declaration</h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleAddLabel}
              className="h-8 w-8"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Accordion type="multiple" className="space-y-2">
            {fields.map((field, index) => {
              const labelName = formInstance.watch(`labels.${index}.name`);

              return (
                <AccordionItem
                  key={field.id}
                  value={`label-${index}`}
                  className="border rounded-lg overflow-hidden border-b-0"
                >
                  <div className="flex items-center bg-muted/30 hover:bg-muted/50 w-full">
                    <Input
                      value={labelName?.toUpperCase() || ''}
                      onChange={(e) => {
                        const upperValue = e.target.value.toUpperCase();
                        formInstance.setValue(`labels.${index}.name`, upperValue);
                      }}
                      placeholder="LABEL_NAME"
                      className="flex-1 font-mono text-sm h-10 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-3"
                    />
                    <AccordionTrigger className="px-2 py-2 hover:no-underline w-auto">
                      <span className="sr-only">Toggle details</span>
                    </AccordionTrigger>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLabel(index)}
                      disabled={fields.length === 1}
                      className="h-8 w-8 mr-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      <FormTextArea
                        name={`labels.${index}.explanation`}
                        label="Label Definition"
                        placeholder="Messages that express intent to make a payment, pay bills, transfer money, or complete transactions..."
                        rows={2}
                      />
                      <FormTextArea
                        name={`labels.${index}.examples`}
                        label="Examples (Few Shots)"
                        placeholder="I want to pay my electricity bill&#10;Can I transfer $100 to John?&#10;How do I make a payment?"
                        rows={3}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <Separator className="my-4" />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="oos-toggle"
              checked={formInstance.watch('includeOOS')}
              onCheckedChange={(checked) =>
                formInstance.setValue('includeOOS', checked === true)
              }
            />
            <Label htmlFor="oos-toggle" className="cursor-pointer">
              Include Out-of-Scope (OOS) detection
            </Label>
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
