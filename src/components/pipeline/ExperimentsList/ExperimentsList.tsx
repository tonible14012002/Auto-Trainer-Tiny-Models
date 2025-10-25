"use client";

import React from "react";
import { PhaseDetail } from "@/schema/schema_v2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useFirstGen } from "@/hooks/pipeline/phase/useFirstGen";

interface ExperimentsListProps {
  phases: PhaseDetail[];
  pipelineId: string;
  refetch: () => void;
}

// Get status badge styling
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

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

export const ExperimentsList: React.FC<ExperimentsListProps> = ({ phases, pipelineId, refetch }) => {
  // Filter phases with phase_number = 0 (initial phases representing separate runs)
  const experiments = phases.filter((phase) => phase.phase_path === "");

  const { mutate: firstGen, isPending } = useFirstGen();

  const handleFirstGen = () => {
    firstGen({ pipelineId }, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  if (experiments.length === 0) {
    return (
      <div className="space-y-4">
        <div className="border rounded-lg bg-white p-8 text-center text-muted-foreground">
          No experiments found
        </div>
        {/* Start First Gen Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleFirstGen}
            disabled={isPending}
            variant="default"
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Starting Generation...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Start First Generation
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {experiments.map((phase, index) => (
        <div
          key={phase.id}
          className="border rounded-lg bg-white p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left side - Main info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Run #{index + 1}
                </span>
                {getStatusBadge(phase.status)}
                {phase.checkpoint_path && (
                  <Badge variant="outline" className="font-mono text-xs">
                    <Database className="w-3 h-3 mr-1" />
                    Checkpoint
                  </Badge>
                )}
              </div>

              <div className="text-xs font-mono text-muted-foreground">
                ID: {phase.id.slice(0, 8)}...
              </div>

              {/* Timestamps */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Created: {formatDate(phase.created_at)}</span>
                </div>
                {phase.completed_at && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Completed:{" "}
                      {formatDate(new Date(phase.completed_at).toISOString())}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Actions */}
            <div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                asChild
              >
                <Link
                  href={ROUTES.PIPELINE_PHASE_DETAIL({
                    pipelineId: phase.pipeline_id,
                    phaseId: phase.id,
                  })}
                >
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Start First Gen Button */}
      <div className="pt-2 flex justify-center">
        <Button
          onClick={handleFirstGen}
          disabled={isPending}
          variant="default"
          className="gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Starting Generation...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Start First Generation
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
