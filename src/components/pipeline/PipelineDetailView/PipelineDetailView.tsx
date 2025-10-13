import { PipelineDetail } from "@/schema/schema_v2";
import { PipelineOverview } from "@/components/pipeline/PipelineOverview/PipelineOverview";
import { PipelinePhaseTable } from "@/components/pipeline/PipelinePhaseTable/PipelinePhaseTable";
import { useFetchPipelineTestSet } from "@/hooks/pipeline/useFetchPipelineTestset";

interface PipelineDetailViewProps {
    pipelineDetail: PipelineDetail;
}

export const PipelineDetailView = (props: PipelineDetailViewProps) => {
    const { pipelineDetail } = props;
    const { data: { data: testsetDetail } = {} } = useFetchPipelineTestSet(pipelineDetail.id);
    if (!pipelineDetail.phases) {
        throw new Error("Pipeline phases are required");
    }

    console.log("Testset Detail:", testsetDetail);

    return (
        <div className="space-y-6">
            <h1 className="mt-4 text-2xl font-bold">
                {pipelineDetail.name || "Unnamed Pipeline"}
            </h1>

            <PipelineOverview pipelineDetail={pipelineDetail} />
            <PipelinePhaseTable phases={pipelineDetail.phases} />
        </div>
    );
}