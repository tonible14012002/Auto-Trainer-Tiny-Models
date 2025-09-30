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

interface Text2TextGenerationFormV2Props {
  modelId: string;
  disabled?: boolean;
  onInferenceSubmit?: (_: any) => void;
}

const schema = z.object({
  input: z.string().min(1, "Input is required"),
  max_new_tokens: z
    .string()
    .min(1)
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    })
    .optional(),
});

export const Text2TextGenerationFormV2 = (
  props: Text2TextGenerationFormV2Props
) => {
  const { onInferenceSubmit, disabled } = props;
  const { config } = useUserConfig();
  const isExpertMode = config?.expertMode ?? false;

  const formInstance = useForm({
    defaultValues: {
      input: "",
      max_new_tokens: "100",
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
          label="Text to transform"
          labelRightEl={
            <ExamplePromptsPopover
              currentTask="text2text-generation"
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
          placeholder="Enter your text..."
        />

        {isExpertMode && (
          <FormInput
            name="max_new_tokens"
            label="Max new tokens"
            description="Maximum number of tokens to generate"
            type="number"
            min={1}
            className="text-sm"
          />
        )}

        <Button type="submit" disabled={disabled} className="w-full">
          Generate
        </Button>
      </form>
    </Form>
  );
};