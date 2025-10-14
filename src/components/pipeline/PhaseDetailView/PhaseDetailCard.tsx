"use client";

import { useState } from "react";
import { PhaseDetail } from "@/schema/schema_v2";
import { ChevronRight, FileText, Brain, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TrainingSection } from "./TrainingSection";
import { EvaluationSection } from "./EvaluationSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

dayjs.extend(relativeTime);

interface PhaseDetailCardProps {
  phase: PhaseDetail;
  labelConfig?: Record<string, string>;
  phaseNumber?: number;
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

export const PhaseDetailCard = ({
  phase,
  labelConfig,
  phaseNumber,
}: PhaseDetailCardProps) => {
  // First level collapse - entire card
  const [isOpen, setIsOpen] = useState(true);

  // Second level collapse - individual sections
  const [isDatasetFilesOpen, setIsDatasetFilesOpen] = useState(true);
  const [isTrainingOpen, setIsTrainingOpen] = useState(true);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(true);

  return (
    <Card className="p-0 gap-0 rounded-lg shadow-none">
      {/* First Level: Card Header */}
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors gap-0 px-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 p-3">
          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
          <div className="flex-1">
            <h3 className="text-sm font-semibold">
              {phaseNumber !== undefined ? `Phase ${phaseNumber}` : "Phase Details"}
            </h3>
          </div>
          {getStatusBadge(phase.status)}
        </div>
      </CardHeader>

      {/* First Level Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <CardContent className="px-0">
          {/* Second Level: Dataset Files Section */}
          <div className="border-t">
            <div
              className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsDatasetFilesOpen(!isDatasetFilesOpen);
              }}
            >
              <ChevronRight
                size={14}
                className={`transition-transform duration-200 ${
                  isDatasetFilesOpen ? "rotate-90" : ""
                }`}
              />
              <FileText className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Dataset Files</h4>
              </div>
              {phase.dataset_files && phase.dataset_files.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {phase.dataset_files.length}
                </Badge>
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isDatasetFilesOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t px-6.5 bg-white">
                {phase.dataset_files && phase.dataset_files.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Samples</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>File Path</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {phase.dataset_files.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell>
                              <Badge>{file.file_type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{file.sample_count}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(file.created_at)}
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {file.file_path}
                              </code>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    No dataset files available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Second Level: Training Section */}
          <div className="border-t">
            <div
              className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsTrainingOpen(!isTrainingOpen);
              }}
            >
              <ChevronRight
                size={14}
                className={`transition-transform duration-200 ${
                  isTrainingOpen ? "rotate-90" : ""
                }`}
              />
              <Brain className="w-4 h-4 text-purple-600" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Training</h4>
              </div>
              {phase.trained_models && phase.trained_models.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {phase.trained_models.length}
                </Badge>
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isTrainingOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-3 border-t bg-accent/50">
                <TrainingSection trainedModels={phase.trained_models} />
              </div>
            </div>
          </div>

          {/* Second Level: Evaluation Section */}
          <div className="border-t">
            <div
              className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsEvaluationOpen(!isEvaluationOpen);
              }}
            >
              <ChevronRight
                size={14}
                className={`transition-transform duration-200 ${
                  isEvaluationOpen ? "rotate-90" : ""
                }`}
              />
              <BarChart3 className="w-4 h-4 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">Evaluation</h4>
              </div>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isEvaluationOpen ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-3 border-t bg-accent/50">
                <EvaluationSection
                  trainedModels={phase.trained_models}
                  labelConfig={labelConfig}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
