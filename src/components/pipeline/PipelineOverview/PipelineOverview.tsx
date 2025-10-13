"use client";

import React from "react";
import { PipelineDetail } from "@/schema/schema_v2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, Database } from "lucide-react";
import { LabelInfoDialog } from "@/components/pipeline/LabelInfoDialog/LabelInfoDialog";

interface PipelineOverviewProps {
    pipelineDetail: PipelineDetail;
}

export const PipelineOverview: React.FC<PipelineOverviewProps> = ({ pipelineDetail }) => {
    const handleGoToTestSet = () => {
        // TODO: Implement navigation to test set
        console.log("Navigate to test set");
    };

    return (
        <div className="space-y-3">
            {/* Action Button Group */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleGoToTestSet}
                >
                    <Database className="w-4 h-4 mr-2" />
                    Go to Test Set
                </Button>
            </div>

            {/* Label Configuration Detail */}
            <div className="p-2.5 border rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Label Configuration</div>
                    <LabelInfoDialog
                        labelConfig={pipelineDetail.label_config}
                        trigger={
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <Info className="w-3 h-3 mr-1" />
                                Details
                            </Button>
                        }
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(pipelineDetail.label_config.id2label).map(([id, label]) => (
                        <Badge key={id} variant="outline" className="font-mono">
                            {label}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
};
