"use client";

import { FormInput } from "@/components/common/Form/FormInput";
import { FormTextArea } from "@/components/common/Form/FormTextArea";
import { FormSelection } from "@/components/common/Form/FormSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import z from "zod";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";
import { Plus, X, Lightbulb } from "lucide-react";
import { useUserConfig } from "@/hooks/useUserConfig";

interface TextGenerationFormV2Props {
  modelId: string;
  disabled?: boolean;
  onInferenceSubmit?: (_: any) => void;
}

const messageSchema = z.object({
  role: z.enum(["system", "user"]),
  content: z.string().min(1, "Message content is required"),
});

const schema = z.object({
  messages: z.array(messageSchema).min(1, "At least one message is required"),
  max_new_tokens: z
    .string()
    .min(1)
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    })
    .optional(),
  temperature: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === "" ||
        (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 2),
      {
        message: "Temperature must be between 0 and 2",
      }
    ),
  top_p: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === "" ||
        (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 1),
      {
        message: "Top P must be between 0 and 1",
      }
    ),
  do_sample: z.boolean(),
});

export const TextGenerationFormV2 = (props: TextGenerationFormV2Props) => {
  const { onInferenceSubmit, disabled } = props;
  const { config } = useUserConfig();
  const isExpertMode = config?.expertMode ?? false;

  const formInstance = useForm({
    defaultValues: {
      messages: [{ role: "user" as const, content: "" }],
      max_new_tokens: "1024",
      temperature: "0.7",
      top_p: "0.9",
      do_sample: false,
    },
    resolver: zodResolver(schema),
  });

  const watchDoSampling = formInstance.watch("do_sample");

  const { fields, append, remove } = useFieldArray({
    control: formInstance.control,
    name: "messages",
  });

  const onSubmit = formInstance.handleSubmit((data) => {
    console.log(data);
    const submitData = {
      messages: data.messages,
      options: isExpertMode && data.do_sample
        ? {
            do_sample: true,
            max_new_tokens: Number(data.max_new_tokens ?? 1024),
            top_p: data.top_p ? Number(data.top_p) : undefined,
            temperature: data.temperature
              ? Number(data.temperature)
              : undefined,
          }
        : {},
    };
    onInferenceSubmit?.(submitData);
  });

  const handlePromptSelect = (prompt: string) => {
    const lastIndex = fields.length - 1;
    const currentContent = formInstance.getValues(
      `messages.${lastIndex}.content`
    );
    const newContent = currentContent ? `${currentContent}\n${prompt}` : prompt;
    formInstance.setValue(`messages.${lastIndex}.content`, newContent);
  };

  const addMessage = () => {
    append({ role: "user", content: "" });
  };

  const removeMessage = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Form {...formInstance}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Text Generation</h3>
          <div className="flex items-center gap-2">
            <ExamplePromptsPopover
              currentTask="text-generation"
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
          </div>
        </div>


        <div className="space-y-4">
          {/* Messages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground">
                Messages
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMessage}
                className="h-7 px-2"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-lg p-3 space-y-3 bg-muted/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        formInstance.watch(`messages.${index}.role`) ===
                        "system"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {formInstance.watch(`messages.${index}.role`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <FormSelection
                      name={`messages.${index}.role`}
                      options={[
                        { label: "System", value: "system" },
                        { label: "User", value: "user" },
                      ]}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMessage(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <FormTextArea
                  name={`messages.${index}.content`}
                  placeholder={
                    formInstance.watch(`messages.${index}.role`) === "system"
                      ? "Enter system instructions..."
                      : "Enter user message..."
                  }
                  className="text-sm min-h-[80px]"
                />
              </div>
            ))}
          </div>

          {/* Advanced Generation Parameters - Expert Mode Only */}
          {isExpertMode && (
            <div className="space-y-4 p-3 rounded-lg bg-muted/10">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  Advanced Options
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={watchDoSampling}
                    onChange={(e) => formInstance.setValue("do_sample", e.target.checked)}
                    className="rounded"
                  />
                  Enable sampling
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput
                  name="max_new_tokens"
                  label="Max new tokens"
                  description="Maximum number of tokens to generate"
                  type="number"
                  min={1}
                  className="text-sm"
                />
              </div>

              {/* Sampling Parameters - only shown when sampling is enabled */}
              {watchDoSampling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t">
                  <FormInput
                    name="temperature"
                    label="Temperature"
                    description="Randomness (0-2)"
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    placeholder="0.7"
                    className="text-sm"
                  />
                  <FormInput
                    name="top_p"
                    label="Top P"
                    description="Nucleus sampling (0-1)"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    placeholder="0.9"
                    className="text-sm"
                  />
                </div>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={disabled}>
            Generate Text
          </Button>
        </div>
      </form>
    </Form>
  );
};