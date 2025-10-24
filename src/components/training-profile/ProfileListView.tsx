"use client";

import { useState } from "react";
import { useFetchTrainingProfiles } from "@/hooks/training-profile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings2,
  Plus,
  Loader2,
  ChevronRight,
  Calendar,
  Layers,
} from "lucide-react";
import { CreateTrainingProfileDialog } from "./CreateTrainingProfileDialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";

dayjs.extend(relativeTime);

export function ProfileListView() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useFetchTrainingProfiles();

  const profiles = response?.data || [];
  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);

  const handleProfileCreated = () => {
    refetch();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Panel - Profile List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Training Profiles
          </h2>
          <CreateTrainingProfileDialog
            trigger={
              <Button size="sm">
                <Plus className="w-4 h-4" />
                Create
              </Button>
            }
            onSuccess={handleProfileCreated}
          />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load training profiles. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && profiles.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                No training profiles yet
              </p>
              <CreateTrainingProfileDialog
                trigger={
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                    Create your first profile
                  </Button>
                }
                onSuccess={handleProfileCreated}
              />
            </CardContent>
          </Card>
        )}

        {!isLoading && profiles.length > 0 && (
          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setSelectedProfileId(profile.id)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-all hover:shadow-md",
                  selectedProfileId === profile.id
                    ? "bg-accent border-primary shadow-sm"
                    : "bg-card hover:bg-accent/50"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {profile.name}
                    </h3>
                    {profile.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {profile.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{dayjs(profile.updated_at).fromNow()}</span>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-transform mt-1 shrink-0",
                      selectedProfileId === profile.id && "rotate-90"
                    )}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel - Profile Details */}
      <div className="lg:col-span-2">
        {!selectedProfile && (
          <Card className="border-dashed h-full flex items-center justify-center">
            <CardContent className="text-center space-y-2 py-12">
              <Settings2 className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Select a profile to view details
              </p>
            </CardContent>
          </Card>
        )}

        {selectedProfile && (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                {selectedProfile.name}
              </CardTitle>
              {selectedProfile.description && (
                <CardDescription>{selectedProfile.description}</CardDescription>
              )}
              <div className="flex gap-4 text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Created:</span>
                  {dayjs(selectedProfile.created_at).format("MMM D, YYYY")}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Updated:</span>
                  {dayjs(selectedProfile.updated_at).fromNow()}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* Training Configuration */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Training Configuration
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(selectedProfile.training_config).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="space-y-1.5 p-3 border rounded-lg bg-muted/30"
                      >
                        <Badge
                          variant="secondary"
                          className="text-xs font-mono"
                        >
                          {key}
                        </Badge>
                        <p className="text-sm font-medium break-words">
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : String(value)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* LoRA Configuration */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  LoRA Configuration
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1.5 p-3 border rounded-lg bg-muted/30">
                    <Badge variant="secondary" className="text-xs font-mono">
                      r
                    </Badge>
                    <p className="text-sm font-medium">
                      {selectedProfile.lora_config.r}
                    </p>
                  </div>
                  <div className="space-y-1.5 p-3 border rounded-lg bg-muted/30">
                    <Badge variant="secondary" className="text-xs font-mono">
                      lora_alpha
                    </Badge>
                    <p className="text-sm font-medium">
                      {selectedProfile.lora_config.lora_alpha}
                    </p>
                  </div>
                  <div className="space-y-1.5 p-3 border rounded-lg bg-muted/30">
                    <Badge variant="secondary" className="text-xs font-mono">
                      lora_dropout
                    </Badge>
                    <p className="text-sm font-medium">
                      {selectedProfile.lora_config.lora_dropout}
                    </p>
                  </div>
                  <div className="space-y-1.5 p-3 border rounded-lg bg-muted/30">
                    <Badge variant="secondary" className="text-xs font-mono">
                      bias
                    </Badge>
                    <p className="text-sm font-medium">
                      {selectedProfile.lora_config.bias}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 p-3 border rounded-lg bg-muted/30">
                  <Badge variant="secondary" className="text-xs font-mono">
                    target_modules
                  </Badge>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedProfile.lora_config.target_modules.map(
                      (module) => (
                        <Badge
                          key={module}
                          variant="outline"
                          className="text-xs"
                        >
                          {module}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
