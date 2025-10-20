"use client";

import { DatasetFileDetail } from "@/schema/schema_v2";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useFetchPhaseDatasetStatus } from "@/hooks/pipeline/phase/useFetchPhaseDatasetStatus";
import { DatasetView } from "@/components/pipeline/DatasetView";

dayjs.extend(relativeTime);

interface GenerationSectionProps {
  phaseId: string;
  datasetFiles?: DatasetFileDetail[];
  labelConfig?: Record<string, string>;
}

const formatDate = (date: string) => {
  try {
    return dayjs(date).fromNow();
  } catch {
    return date;
  }
};

export const GenerationSection = ({
  phaseId,
  datasetFiles,
  labelConfig,
}: GenerationSectionProps) => {
  const { data: { data: generationStatus } = {}, isLoading } = useFetchPhaseDatasetStatus(phaseId);

  const datasetFile = generationStatus?.dataset_file;
  const batchFiles = generationStatus?.batch_files || [];
  const isGenerating = datasetFile?.status === "generating";

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Loading dataset status...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Dataset File with Status */}
      {datasetFile && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="font-medium text-sm">Dataset File</h4>
            {isGenerating && (
              <Badge variant="secondary" className="gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                Generating
              </Badge>
            )}
            {datasetFile.status === "done" && (
              <Badge variant="default">Complete</Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {datasetFile.current_sample_count || datasetFile.sample_count} samples
            </span>
          </div>
          {datasetFile.samples && datasetFile.samples.length > 0 && (
            <DatasetView
              samples={datasetFile.samples}
              labelConfig={labelConfig}
            />
          )}
        </div>
      )}

      {/* Batch Dataset Files */}
      {batchFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Batch Datasets ({batchFiles.length})</h4>
          {batchFiles.map((batch) => (
            <div key={batch.id} className="flex items-center gap-2">
              <h5 className="font-medium text-sm">Batch {batch.batch_number}</h5>
              <span className="text-xs text-muted-foreground">
                {batch.sample_count} samples
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Dataset Files - Legacy table view */}
      {datasetFiles && datasetFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Dataset Files Info
          </h4>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Samples</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>File Path</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasetFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <Badge>{file.file_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {file.status === "generating" && (
                        <Badge variant="secondary" className="gap-1.5">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Generating
                        </Badge>
                      )}
                      {file.status === "done" && (
                        <Badge variant="default">Complete</Badge>
                      )}
                      {!file.status && <span className="text-xs text-muted-foreground">-</span>}
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
        </div>
      )}
    </div>
  );
};
