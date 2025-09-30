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
import { MicIcon } from "lucide-react";

interface AutomaticSpeechRecognitionProps {
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

export const AutomaticSpeechRecognitionForm = (
  props: AutomaticSpeechRecognitionProps
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
      <form className="p-4 rounded-xl border" onSubmit={onSubmit}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-xs md:text-sm">
            Automatic Speech Recognition
          </h3>
        </div>
        <div className="space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex md:items-center justify-between md:flex-row flex-col gap-3">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="file">Upload File</TabsTrigger>
                <TabsTrigger value="url">Audio URL</TabsTrigger>
              </TabsList>
              {activeTab === "url" && (
                <ExamplePromptsPopover
                  currentTask="automatic-speech-recognition"
                  onSelectPrompt={handlePromptSelect}
                />
              )}
            </div>
            <TabsContent value="file" className="space-y-4 mt-4">
              <div className="space-y-1">
                <Label
                  className="block text-xs text-muted-foreground font-medium"
                  htmlFor="audio-file"
                >
                  Audio File
                </Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="text-sm"
                />
              </div>
            </TabsContent>
            <TabsContent value="url" className="space-y-4 mt-4">
              <div className="space-y-1">
                <label
                  className="block text-xs text-muted-foreground font-medium"
                  htmlFor="audio-url"
                >
                  Audio URL
                </label>
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
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex flex-col gap-3 md:flex-row">
            <Button
              variant="default"
              type="submit"
              ref={btnRef}
              disabled={disabled}
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
                <Button variant="destructive" type="button" disabled={disabled}>
                  <MicIcon />
                  Record Speech
                </Button>
              }
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
