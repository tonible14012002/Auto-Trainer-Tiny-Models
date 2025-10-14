"use client";

import React from "react";
import { PhaseDetail } from "@/schema/schema_v2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface PipelinePhaseTableProps {
    phases: PhaseDetail[];
}

export const PipelinePhaseTable: React.FC<PipelinePhaseTableProps> = ({ phases }) => {
    // Filter phases with phase_number = 0 (initial phases representing separate runs)
    const initialPhases = phases.filter((phase) => phase.phase_path === "");

    // Get status badge styling
    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completed
                    </Badge>
                );
            case "running":
            case "in_progress":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Running
                    </Badge>
                );
            case "failed":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
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

    return (
        <div className="space-y-4">
            {initialPhases.length === 0 ? (
                <div className="border rounded-lg bg-white p-8 text-center text-muted-foreground">
                    No runs found
                </div>
            ) : (
                initialPhases.map((phase) => (
                    <div key={phase.id} className="space-y-2">
                        <div className="border rounded-lg bg-white">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Phase ID</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Completed At</TableHead>
                                        <TableHead>Checkpoint</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-mono text-xs">
                                            {phase.id.slice(0, 8)}...
                                        </TableCell>
                                        <TableCell>{getStatusBadge(phase.status)}</TableCell>
                                        <TableCell className="text-sm">
                                            {formatDate(phase.created_at)}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {phase.completed_at
                                                ? formatDate(new Date(phase.completed_at).toISOString())
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {phase.checkpoint_path ? (
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    <Database className="w-3 h-3 mr-1" />
                                                    Available
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
