"use client";

import { PhaseDetail } from "@/schema/schema_v2";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Database, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface PhaseHeaderProps {
  phase: PhaseDetail;
}

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case "running":
    case "in_progress":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Running
        </Badge>
      );
    case "failed":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const formatDate = (date: string) => {
  try {
    return dayjs(date).fromNow();
  } catch {
    return date;
  }
};

export const PhaseHeader = ({ phase }: PhaseHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Phase Details</CardTitle>
            <CardDescription className="mt-1">
              Created {formatDate(phase.created_at)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(phase.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Phase ID:</span>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{phase.id}</code>
          </div>
          {phase.checkpoint_path && (
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Checkpoint:</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded truncate max-w-[200px]">
                {phase.checkpoint_path}
              </code>
            </div>
          )}
          {phase.completed_at && (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Completed:</span>
              <span>{formatDate(new Date(phase.completed_at).toISOString())}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
