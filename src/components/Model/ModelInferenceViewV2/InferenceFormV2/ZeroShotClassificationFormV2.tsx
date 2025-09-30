"use client";

import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { FormInput } from "@/components/common/Form/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Lightbulb } from "lucide-react";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";
import { useUserConfig } from "@/hooks/useUserConfig";

interface ZeroShotClassificationFormV2Props {
  modelId: string;
  disabled?: boolean;
  onInferenceSubmit?: (_: any) => void;
}

const schema = z.object({
  input: z.string().min(1, "Input is required"),
  labels: z.string().min(1, "Labels are required"),
  template: z.string().optional(),
});

export const ZeroShotClassificationFormV2 = (
  props: ZeroShotClassificationFormV2Props
) => {
  const { onInferenceSubmit, disabled } = props;
  const { config } = useUserConfig();
  const isExpertMode = config?.expertMode ?? false;

  const formInstance = useForm({
    defaultValues: {
      input: "",
      labels: "Payment, Not Payment",
      template: "This text is {} related",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = formInstance.handleSubmit((data) => {
    // Convert comma-separated labels string to array
    const labelsArray = data.labels
      .split(",")
      .map((label) => label.trim())
      .filter((label) => label.length > 0);

    onInferenceSubmit?.({
      text: data.input,
      labels: labelsArray,
      ...(data.template && { template: data.template }),
    });
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
              currentTask="zero-shot-classification"
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
          <>
            <FormInput
              name="labels"
              label="Labels (comma-separated)"
              description='Enter labels separated by commas (e.g., "positive, negative, neutral")'
              placeholder="positive, negative, neutral"
              className="text-sm"
            />

            <FormInput
              name="template"
              label="Hypothesis template"
              description="Use {} as placeholder for label"
              placeholder="This is {} related"
              className="text-sm"
            />
          </>
        )}

        <Button type="submit" disabled={disabled} className="w-full">
          Classify
        </Button>
      </form>
    </Form>
  );
};
