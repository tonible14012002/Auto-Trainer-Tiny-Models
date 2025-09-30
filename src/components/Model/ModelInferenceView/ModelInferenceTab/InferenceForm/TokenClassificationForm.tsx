"use client";

import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";

interface TokenClassificationFormProps {
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

export const TokenClassificationForm = (
  props: TokenClassificationFormProps
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
      <form className="p-4 rounded-xl border" onSubmit={onSubmit}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-xs md:text-sm">
            Token Classification
          </h3>
          <ExamplePromptsPopover
            currentTask="token-classification"
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
              placeholder="Enter the text for token classification..."
            />
          </div>
          {/* <div className="space-y-1">
            <label
              className="block text-xs text-muted-foreground font-medium"
              htmlFor="aggregation-strategy"
            >
              Aggregation Strategy
            </label>
            <FormSelection
              name="aggregation_strategy"
              options={[
                { label: "None", value: "null" },
                { label: "Simple", value: "simple" },
                { label: "First", value: "first" },
                { label: "Average", value: "average" },
                { label: "Max", value: "max" },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              Strategy for aggregating token predictions
            </p>
          </div> */}
          <div className="flex flex-col">
            <Button type="submit" disabled={disabled}>
              Classify Tokens
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
