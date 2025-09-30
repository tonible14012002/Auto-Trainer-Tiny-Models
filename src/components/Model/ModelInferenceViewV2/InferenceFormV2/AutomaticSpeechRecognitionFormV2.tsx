"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { ExamplePromptsPopover } from "@/components/common/ExamplePromptsPopover";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { AudioRecorderDialog } from "@/components/common/AudioRecorderDialog";
import { MicIcon, Lightbulb } from "lucide-react";

interface AutomaticSpeechRecognitionV2Props {
  modelId: string;
  disabled?: boolean;
  onInferenceSubmit?: (data: any) => void;
}

const schema = z
  .object({
    audioFile: z.instanceof(File).optional(),
    audioUrl: z.string().optional(),
    inputType: z.enum(["file", "url"]),
  })
  .refine((data) => data.audioFile || data.audioUrl, {
    message: "Either an audio file or URL is required",
  });

export const AutomaticSpeechRecognitionFormV2 = (
  props: AutomaticSpeechRecognitionV2Props
) => {
  const { onInferenceSubmit, disabled } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("file");
  const btnRef = useRef<HTMLButtonElement>(null);

  const formInstance = useForm({
    defaultValues: {
      audioFile: undefined,
      audioUrl: "",
      inputType: "file" as "file" | "url",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = formInstance.handleSubmit((data) => {
    onInferenceSubmit?.(data);
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formInstance.setValue("audioFile", file);
      formInstance.setValue("audioUrl", "");
      formInstance.setValue("inputType", "file");
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    formInstance.setValue("inputType", value as "file" | "url");
    if (value === "file") {
      formInstance.setValue("audioUrl", "");
    } else {
      formInstance.setValue("audioFile", undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePromptSelect = (prompt: string) => {
    formInstance.setValue("audioUrl", prompt);
    formInstance.setValue("audioFile", undefined);
    formInstance.setValue("inputType", "url");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Form {...formInstance}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Audio Input</Label>
            {activeTab === "url" && (
              <ExamplePromptsPopover
                currentTask="automatic-speech-recognition"
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
            )}
          </div>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="w-full">
              <TabsTrigger value="file" className="flex-1">Upload File</TabsTrigger>
              <TabsTrigger value="url" className="flex-1">Audio URL</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-3 mt-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="text-sm"
              />
            </TabsContent>

            <TabsContent value="url" className="space-y-3 mt-4">
              <Input
                {...formInstance.register("audioUrl")}
                type="url"
                placeholder="Enter audio URL..."
                className="text-sm"
                onChange={(e) => {
                  formInstance.setValue("audioUrl", e.target.value);
                  formInstance.setValue("inputType", "url");
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="submit"
            ref={btnRef}
            disabled={disabled}
            className="flex-1"
          >
            Transcribe Audio
          </Button>
          <AudioRecorderDialog
            onRecordFinish={(audioBlob) => {
              formInstance.setValue(
                "audioFile",
                new File([audioBlob], "recording.wav")
              );
              formInstance.setValue("inputType", "file");
              btnRef.current?.click();
            }}
            trigger={
              <Button variant="outline" type="button" disabled={disabled} className="flex-1 sm:flex-initial">
                <MicIcon className="w-4 h-4 mr-2" />
                Record
              </Button>
            }
          />
        </div>
      </form>
    </Form>
  );
};