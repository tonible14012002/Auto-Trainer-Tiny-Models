"use client";

import { BaseDatasetDetail, DatasetFileDetail } from "@/schema/schema_v2";
import { Badge } from "@/components/ui/badge";
import { Database, FileText } from "lucide-react";
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

dayjs.extend(relativeTime);

interface GenerationSectionProps {
  composalDatasets?: BaseDatasetDetail[];
  datasetFiles?: DatasetFileDetail[];
}

const formatDate = (date: string) => {
  try {
    return dayjs(date).fromNow();
  } catch {
    return date;
  }
};

export const GenerationSection = ({
  composalDatasets,
  datasetFiles,
}: GenerationSectionProps) => {
  const hasData = (composalDatasets && composalDatasets.length > 0) ||
                  (datasetFiles && datasetFiles.length > 0);

  if (!hasData) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No generation data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Training Pool */}
      {composalDatasets && composalDatasets.length > 0 && (
        <div className="space-y-3">
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Samples</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>File</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {composalDatasets.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {dataset.description || "No description"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{dataset.total_samples}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(dataset.created_at)}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {dataset.file_path.split('/').pop()}
                      </code>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Dataset Files */}
      {datasetFiles && datasetFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Dataset Files
          </h4>
          <div className="border rounded-lg overflow-x-auto">
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
                {datasetFiles.map((file) => (
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
        </div>
      )}
    </div>
  );
};
