"use client";

import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";

interface SummarizeInferenceFormProps {
  modelId: string;
  disabled?: boolean;
  onInferenceSubmit?: (_: any) => void;
}

const schema = z.object({
  input: z.string().min(1, "Input is required"),
});

export const SummarizeInferenceForm = (props: SummarizeInferenceFormProps) => {
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
      <form className="p-4 rounded-xl border" onSubmit={onSubmit}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-xs md:text-sm">Summarize Text</h3>
          <ExamplePromptsPopover
            currentTask="summarization"
            onSelectPrompt={handlePromptSelect}
          />
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
              className="min-h-[100px] text-sm"
              placeholder="Enter the text you want to summarize..."
            />
          </div>
          <div className="flex flex-col">
            <Button variant="default" type="submit" disabled={disabled}>
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
