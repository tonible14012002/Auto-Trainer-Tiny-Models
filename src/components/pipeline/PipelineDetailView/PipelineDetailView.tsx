"use client";

import { useState } from "react";
import { PipelineDetail } from "@/schema/schema_v2";
import { PipelineOverview } from "@/components/pipeline/PipelineOverview/PipelineOverview";
import { ExperimentsList } from "@/components/pipeline/ExperimentsList";
import { DatasetView } from "@/components/pipeline/DatasetView";
import { useFetchPipelineTestSet } from "@/hooks/pipeline/useFetchPipelineTestset";
import { ChevronRight } from "lucide-react";

interface PipelineDetailViewProps {
  pipelineDetail: PipelineDetail;
}

export const PipelineDetailView = (props: PipelineDetailViewProps) => {
  const { pipelineDetail } = props;
  const [isDatasetOpen, setIsDatasetOpen] = useState(true);
  const [isExperimentsOpen, setIsExperimentsOpen] = useState(true);

  const { data: { data: testsetDetail } = {} } = useFetchPipelineTestSet(
    pipelineDetail.id
  );
  if (!pipelineDetail.phases) {
    throw new Error("Pipeline phases are required");
  }

  return (
    <div className="space-y-4 pb-10">
      <h1 className="mt-4 text-2xl font-bold">
        {pipelineDetail.name || "Unnamed Pipeline"}
      </h1>
      <PipelineOverview pipelineDetail={pipelineDetail} />

      {/* Experiments Section */}
      <div className="border rounded-lg bg-white">
        <div
          className="p-4 flex items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setIsExperimentsOpen(!isExperimentsOpen)}
        >
          <ChevronRight
            size={14}
            className={`transition-transform duration-200 ${
              isExperimentsOpen ? "rotate-90" : ""
            }`}
          />
          <h3 className="font-medium text-sm">Experiments</h3>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExperimentsOpen
              ? "max-h-[2000px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 border-t">
            <ExperimentsList phases={pipelineDetail.phases} />
          </div>
        </div>
      </div>

      {/* Test Set Dataset View */}
      {testsetDetail?.samples && testsetDetail.samples.length > 0 && (
        <div className="border rounded-lg bg-white">
          <div
            className="p-4 flex items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setIsDatasetOpen(!isDatasetOpen)}
          >
            <ChevronRight
              size={14}
              className={`transition-transform duration-200 ${
                isDatasetOpen ? "rotate-90" : ""
              }`}
            />
            <h3 className="font-medium text-sm">Evaluation Dataset</h3>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isDatasetOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 border-t">
              <DatasetView
                samples={testsetDetail.samples}
                labelConfig={pipelineDetail.label_config.id2label}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
