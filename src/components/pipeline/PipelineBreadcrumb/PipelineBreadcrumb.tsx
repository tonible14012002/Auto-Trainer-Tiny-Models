"use client";

import { useParams, usePathname } from "next/navigation";
import { PipelinePhaseParams } from "@/constants/routes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useFetchPipeline } from "@/hooks/pipeline/useFetchPipeline";
import { useFetchPhase } from "@/hooks/pipeline/phase/useFetchPhase";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface PipelineBreadcrumbProps {
  className?: string;
}

export function PipelineBreadcrumb({ className }: PipelineBreadcrumbProps) {
  const pathname = usePathname();
  const params = useParams<PipelinePhaseParams>();
  const pipelineId = params?.pipelineId;
  const phaseId = params?.phaseId;

  const { data: { data: pipelineDetail } = {} } = useFetchPipeline(pipelineId);
  const { data: { data: phaseDetail } = {} } = useFetchPhase(phaseId);

  // Don't render if we don't have a pipeline ID
  if (!pipelineId) {
    return null;
  }

  // Determine the current level based on pathname
  const isPhaseLevel = pathname?.includes("/phases/") && phaseId;
  // Placeholder for future internal levels (e.g., /phases/[phaseId]/training/[trainingId])
  const isInternalLevel = false; // Will be determined by future pathname patterns

  return (
    <div className="px-4 pt-4 pb-4 bg-white border-b">
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {/* Pipeline level - always shown */}
          <BreadcrumbItem>
            {isPhaseLevel || isInternalLevel ? (
              <BreadcrumbLink asChild>
                <Link href={ROUTES.PIPELINE_DETAIL(pipelineId)}>
                  {pipelineDetail?.name || "Pipeline"}
                </Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>
                {pipelineDetail?.name || "Pipeline"}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>

          {/* Phase level - shown when in phase or deeper */}
          {isPhaseLevel && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isInternalLevel ? (
                  <BreadcrumbLink asChild>
                    <Link
                      href={ROUTES.PIPELINE_PHASE_DETAIL({
                        pipelineId,
                        phaseId,
                      })}
                    >
                      {phaseDetail?.phase_path || phaseId}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>
                    {phaseDetail?.phase_path || phaseId}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </>
          )}

          {/* Internal level - placeholder for future use */}
          {isInternalLevel && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {/* Will be populated with internal level name */}
                  Internal Level
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
