"use client";

import { FormSelection } from "@/components/common/Form/FormSelect";
import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";

interface TextClassificationFormProps {
  modelId: string;
  disabled?: boolean;
  onInferenceSubmit?: (_: any) => void;
}

const schema = z.object({
  input: z.string().min(1, "Input is required"),
  topK: z
    .string()
    .min(1)
    .optional()
    .refine((val) => val === "null" || !isNaN(Number(val)), {
      message: "Top K must be a number or null value",
    }),
});

export const TextClassificationForm = (props: TextClassificationFormProps) => {
  const { onInferenceSubmit, disabled } = props;
  const formInstance = useForm({
    defaultValues: {
      input: "",
      topK: "null",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = formInstance.handleSubmit((data) => {
    onInferenceSubmit?.(data);
  });

  const handlePromptSelect = (prompt: string) => {
    formInstance.setValue("input", prompt);
  };

  return (
    <Form {...formInstance}>
      <form className="p-4 rounded-xl border" onSubmit={onSubmit}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-xs md:text-sm">
            Text Classification
          </h3>
          <ExamplePromptsPopover
            currentTask="text-classification"
            onSelectPrompt={handlePromptSelect}
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label
              className="block text-xs text-muted-foreground font-medium"
              htmlFor="user-input"
            >
              Text to classify
            </label>
            <FormTextArea
              name="input"
              cols={5}
              className="text-sm"
              placeholder="Enter the text you want to classify..."
            />
          </div>
          <div className="space-y-1">
            <label
              className="block text-xs text-muted-foreground font-medium"
              htmlFor="top-k"
            >
              Top K
            </label>
            <FormSelection
              name="topK"
              options={["null", 1, 2, 3, 4, 5].map((value) => ({
                label: value.toString(),
                value: value.toString(),
              }))}
            />
            <p className="text-xs text-muted-foreground">
              Number of top predictions to return (null for all)
            </p>
          </div>
          <div className="flex flex-col">
            <Button type="submit" disabled={disabled}>
              Classify
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
