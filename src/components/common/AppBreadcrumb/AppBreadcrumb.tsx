"use client";

import { useModels } from "@/provider/ModelsProvider";
import { useParams, usePathname } from "next/navigation";
import { PipelineParams } from "@/constants/routes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AppBreadcrumbProps {
  className?: string;
}

export function AppBreadcrumb({ className }: AppBreadcrumbProps) {
  const { selectedModel } = useModels();
  const pathname = usePathname();
  const params = useParams<PipelineParams>();

  // Check if current page is a trainer page
  const isPipelinePage = pathname?.startsWith("/pipeline/");

  if (isPipelinePage && params?.pipelineId) {
    return null;
  }

  if (!selectedModel) {
    return null;
  }

  return (
    <div className="px-4 pt-4 pb-4 bg-white border-b">
      <Breadcrumb className={className}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>{selectedModel.category}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{selectedModel.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
