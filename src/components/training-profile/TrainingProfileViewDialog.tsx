"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFetchTrainingProfile } from "@/hooks/training-profile";
import { Badge } from "@/components/ui/badge";
import { Settings2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface TrainingProfileViewDialogProps {
  profileId: string;
  trigger: React.ReactNode;
}

export function TrainingProfileViewDialog({
  profileId,
  trigger,
}: TrainingProfileViewDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    data: response,
    isLoading,
    error,
  } = useFetchTrainingProfile(profileId, {
    ignoreRefetch: !open,
  });

  const profile = response?.data;

  const content = (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load training profile. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {profile && (
        <>
          {/* Profile Info */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold">Profile Name</h3>
              <p className="text-sm text-muted-foreground">{profile.name}</p>
            </div>

            {profile.description && (
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {profile.description}
                </p>
              </div>
            )}

            <div className="flex gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium">Created: </span>
                {dayjs(profile.created_at).fromNow()}
              </div>
              <div>
                <span className="font-medium">Updated: </span>
                {dayjs(profile.updated_at).fromNow()}
              </div>
            </div>
          </div>

          {/* Training Configuration */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Training Configuration
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(profile.training_config).map(([key, value]) => (
                <div
                  key={key}
                  className="space-y-1 p-2.5 border rounded-lg bg-muted/30"
                >
                  <Badge variant="secondary" className="text-xs font-mono">
                    {key}
                  </Badge>
                  <p className="text-sm font-medium">
                    {typeof value === "number"
                      ? value.toLocaleString()
                      : String(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* LoRA Configuration */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">LoRA Configuration</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 p-2.5 border rounded-lg bg-muted/30">
                <Badge variant="secondary" className="text-xs font-mono">
                  r
                </Badge>
                <p className="text-sm font-medium">{profile.lora_config.r}</p>
              </div>
              <div className="space-y-1 p-2.5 border rounded-lg bg-muted/30">
                <Badge variant="secondary" className="text-xs font-mono">
                  lora_alpha
                </Badge>
                <p className="text-sm font-medium">
                  {profile.lora_config.lora_alpha}
                </p>
              </div>
              <div className="space-y-1 p-2.5 border rounded-lg bg-muted/30">
                <Badge variant="secondary" className="text-xs font-mono">
                  lora_dropout
                </Badge>
                <p className="text-sm font-medium">
                  {profile.lora_config.lora_dropout}
                </p>
              </div>
              <div className="space-y-1 p-2.5 border rounded-lg bg-muted/30">
                <Badge variant="secondary" className="text-xs font-mono">
                  bias
                </Badge>
                <p className="text-sm font-medium">
                  {profile.lora_config.bias}
                </p>
              </div>
            </div>
            <div className="space-y-1.5 p-2.5 border rounded-lg bg-muted/30">
              <Badge variant="secondary" className="text-xs font-mono">
                target_modules
              </Badge>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {profile.lora_config.target_modules.map((module) => (
                  <Badge key={module} variant="outline" className="text-xs">
                    {module}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Training Profile Details
          </DialogTitle>
          <DialogDescription>
            View training and LoRA configuration details
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
