"use client";

import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Lightbulb } from "lucide-react";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";

interface TokenClassificationFormV2Props {
  modelId: string;
  disabled?: boolean;
  onInferenceSubmit?: (_: any) => void;
}

const schema = z.object({
  input: z.string().min(1, "Input is required"),
  aggregation_strategy: z
    .string()
    .min(1)
    .optional()
    .refine(
      (val) =>
        val === "null" ||
        ["simple", "first", "average", "max"].includes(val || ""),
      {
        message: "Aggregation strategy must be a valid option",
      }
    ),
});

export const TokenClassificationFormV2 = (
  props: TokenClassificationFormV2Props
) => {
  const { onInferenceSubmit, disabled } = props;
  const formInstance = useForm({
    defaultValues: {
      input: "",
      aggregation_strategy: "null",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = formInstance.handleSubmit((data) => {
    onInferenceSubmit?.({
      text: data.input,
      options: {
        aggregation_strategy:
          data.aggregation_strategy === "null"
            ? undefined
            : data.aggregation_strategy,
      },
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
              currentTask="token-classification"
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
          placeholder="Enter the text for token classification..."
        />

        <Button type="submit" disabled={disabled} className="w-full">
          Classify Tokens
        </Button>
      </form>
    </Form>
  );
};