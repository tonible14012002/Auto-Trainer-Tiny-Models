"use client";

import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { FormInput } from "@/components/common/Form/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";

interface Text2TextGenerationFormProps {
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

export const Text2TextGenerationForm = (
  props: Text2TextGenerationFormProps
) => {
  const { onInferenceSubmit, disabled } = props;
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
      <form className="p-4 rounded-xl border" onSubmit={onSubmit}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-xs md:text-sm">Text2Text Generation</h3>
          <ExamplePromptsPopover currentTask="text-classification" onSelectPrompt={handlePromptSelect} />
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label
              className="block text-xs text-muted-foreground font-medium"
              htmlFor="user-input"
            >
              User input
            </label>
            <FormTextArea
              name="input"
              cols={5}
              className="text-sm"
              placeholder="Enter your text..."
            />
          </div>
          <div className="space-y-1">
            <label
              className="block text-xs text-muted-foreground font-medium"
              htmlFor="max_new_tokens"
            >
              Max new tokens
            </label>
            <FormInput name="max_new_tokens" type="number" min={1} />
          </div>
          <Button type="submit" className="w-full" disabled={disabled}>
            Generate
          </Button>
        </div>
      </form>
    </Form>
  );
};
