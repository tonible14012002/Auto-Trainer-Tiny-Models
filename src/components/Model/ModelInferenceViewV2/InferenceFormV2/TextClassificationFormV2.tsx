"use client";

import { FormSelection } from "@/components/common/Form/FormSelect";
import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Lightbulb } from "lucide-react";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";
import { useUserConfig } from "@/hooks/useUserConfig";

interface TextClassificationFormV2Props {
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

export const TextClassificationFormV2 = (props: TextClassificationFormV2Props) => {
  const { onInferenceSubmit, disabled } = props;
  const { config } = useUserConfig();
  const isExpertMode = config?.expertMode ?? false;

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
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormTextArea
          name="input"
          label="Text to classify"
          labelRightEl={
            <ExamplePromptsPopover
              currentTask="text-classification"
              onSelectPrompt={handlePromptSelect}
              triggerEl={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  aria-label="Show example prompts"
                >
                  <Lightbulb className="h-4 w-4" />
                </Button>
              }
            />
          }
          cols={5}
          className="text-sm"
          placeholder="Enter the text you want to classify..."
        />

        {isExpertMode && (
          <FormSelection
            name="topK"
            label="Top K"
            description="Number of top predictions to return (null for all)"
            options={["null", 1, 2, 3, 4, 5].map((value) => ({
              label: value.toString(),
              value: value.toString(),
            }))}
            className="text-sm"
          />
        )}

        <Button type="submit" disabled={disabled} className="w-full">
          Classify
        </Button>
      </form>
    </Form>
  );
};