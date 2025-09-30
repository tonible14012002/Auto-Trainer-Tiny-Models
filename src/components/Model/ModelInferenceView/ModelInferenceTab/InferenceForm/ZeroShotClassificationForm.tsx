"use client";

import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { FormInput } from "@/components/common/Form/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";

interface ZeroShotClassificationFormProps {
  modelId: string;
  disabled?: boolean;
  onInferenceSubmit?: (_: any) => void;
}

const schema = z.object({
  input: z.string().min(1, "Input is required"),
  labels: z.string().min(1, "Labels are required"),
  template: z.string().optional(),
});

export const ZeroShotClassificationForm = (
  props: ZeroShotClassificationFormProps
) => {
  const { onInferenceSubmit, disabled } = props;
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
    });
  });

  const handlePromptSelect = (prompt: string) => {
    formInstance.setValue("input", prompt);
  };

  return (
    <Form {...formInstance}>
      <form className="p-4 rounded-xl border" onSubmit={onSubmit}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-xs md:text-sm">
            Zero-Shot Classification
          </h3>
          <ExamplePromptsPopover
            currentTask="zero-shot-classification"
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
              htmlFor="labels"
            >
              Labels (comma-separated)
            </label>
            <FormInput
              name="labels"
              placeholder="positive, negative, neutral"
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Enter labels separated by commas (e.g., &quot;positive, negative, neutral&quot;)
            </p>
            <div className="space-y-1">
              <label
                className="block text-xs text-muted-foreground font-medium"
                htmlFor="labels"
              >
                Hypothesis template
              </label>
              <FormInput
                name="template"
                placeholder="This is {} related"
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use &#123;&#125; as placeholder for label
              </p>
            </div>
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
