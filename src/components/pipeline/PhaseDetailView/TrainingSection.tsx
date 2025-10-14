"use client";

import { TrainedModelInfo } from "@/schema/schema_v2";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface TrainingSectionProps {
  trainedModels?: TrainedModelInfo[];
}

const formatDate = (date: string) => {
  try {
    return dayjs(date).fromNow();
  } catch {
    return date;
  }
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    completed: "default",
    running: "secondary",
    failed: "destructive",
    pending: "outline",
  };
  return (
    <Badge variant={variants[status] || "outline"}>
      {status}
    </Badge>
  );
};

export const TrainingSection = ({ trainedModels }: TrainingSectionProps) => {
  if (!trainedModels || trainedModels.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No trained models available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trainedModels.map((model) => (
        <Card key={model.id} className="p-4 gap-0 rounded-sm shadow-none">
          <CardHeader className="px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <CardTitle className="text-sm">{model.model_name}</CardTitle>
              {getStatusBadge(model.status)}
            </div>
            <CardDescription className="flex items-center gap-2 text-xs">
              <Calendar className="w-3 h-3" />
              Created {formatDate(model.created_at)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Model Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Model Path:</span>
                  <code className="block text-xs bg-muted px-2 py-1 rounded mt-1 truncate">
                    {model.model_save_path}
                  </code>
                </div>
                {model.training_time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Training Time:</span>
                    <span>{model.training_time}s</span>
                  </div>
                )}
              </div>

              {/* Training Parameters */}
              {model.training_params && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Training Parameters</h5>
                  <div className="bg-muted rounded p-3 text-xs overflow-x-auto">
                    <pre>{JSON.stringify(model.training_params, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
