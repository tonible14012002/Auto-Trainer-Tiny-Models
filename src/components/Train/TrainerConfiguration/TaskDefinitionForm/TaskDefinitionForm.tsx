"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, PlusIcon, Trash } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { FormCheckbox } from "@/components/common/Form/FormCheckbox";
import { LabelDefineFormPopup } from "./LabelDefineFormPopup";

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

export type LabelData = z.infer<typeof labelSchema>;

export const TaskDefinitionForm: React.FC<TaskDefinitionFormProps> = ({
  onBack,
  onSave,
  initialData,
}) => {
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [editingLabelIndex, setEditingLabelIndex] = React.useState<number | null>(null);
  const [popupInitialData, setPopupInitialData] = React.useState<LabelData | undefined>();

  const formInstance = useForm<TaskDefinitionData>({
    defaultValues: initialData || {
      taskType: "text-classification",
      modelPurpose: "",
      dataType: "",
      labels: [],
      includeOOS: false,
    },
    resolver: zodResolver(taskDefinitionSchema),
  });

  const { fields, append, remove, update } = useFieldArray({
    control: formInstance.control,
    name: "labels",
  });

  // Open popup for adding new label
  const handleAddLabel = () => {
    setEditingLabelIndex(null);
    setPopupInitialData(undefined);
    setPopupOpen(true);
  };

  // Open popup for editing existing label
  const handleEditLabel = (index: number) => {
    const labelData = formInstance.getValues(`labels.${index}`);
    setEditingLabelIndex(index);
    setPopupInitialData(labelData);
    setPopupOpen(true);
  };

  const handleRemoveLabel = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Save label data from popup back to form
  const handleSaveLabel = (data: LabelData) => {
    if (editingLabelIndex !== null) {
      // Update existing label
      update(editingLabelIndex, data);
    } else {
      // Add new label
      append(data);
    }
    setPopupOpen(false);
  };

  const handleSubmit = formInstance.handleSubmit((data) => {
    onSave(data);
  });

  return (
    <>
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
              value={formInstance.watch("taskType")}
              onValueChange={(value) =>
                formInstance.setValue("taskType", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-classification">
                  Text Classification
                </SelectItem>
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
            </div>

            {/* Labels List */}
            {fields.length > 0 && (
              <div className="space-y-2">
                {fields.map((field, index) => {
                  const label = formInstance.watch(`labels.${index}`);
                  return (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleEditLabel(index)}
                    >
                      <div className="flex-1">
                        <p className="font-mono text-sm font-medium">
                          {label.name || "Unnamed Label"}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {label.explanation || "No explanation"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLabel(index);
                        }}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Label Button */}
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddLabel}
                className="w-full"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Label
              </Button>
            </div>

            <Separator className="my-4" />
            <div className="flex items-center space-x-2">
              <FormCheckbox name="includeOOS" id="oos-toggle"></FormCheckbox>
              <Label htmlFor="oos-toggle" className="cursor-pointer">
                Include Out-of-Scope (OOS) detection
              </Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
      <LabelDefineFormPopup
        open={popupOpen}
        onOpenChange={setPopupOpen}
        initialData={popupInitialData}
        onSave={handleSaveLabel}
      />
    </>
  );
};
