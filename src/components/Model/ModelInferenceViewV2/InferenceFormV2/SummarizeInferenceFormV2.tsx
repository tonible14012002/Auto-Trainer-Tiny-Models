"use client";

import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Lightbulb } from "lucide-react";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";

interface SummarizeInferenceFormV2Props {
  modelId: string;
  disabled?: boolean;
  onInferenceSubmit?: (_: any) => void;
}

const schema = z.object({
  input: z.string().min(1, "Input is required"),
});

export const SummarizeInferenceFormV2 = (props: SummarizeInferenceFormV2Props) => {
  const { onInferenceSubmit, disabled } = props;
  const formInstance = useForm({
    defaultValues: {
      input: "",
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
          label="Text to summarize"
          labelRightEl={
            <ExamplePromptsPopover
              currentTask="summarization"
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
          placeholder="Enter the text you want to summarize..."
        />

        <Button type="submit" disabled={disabled} className="w-full">
          Summarize
        </Button>
      </form>
    </Form>
  );
};