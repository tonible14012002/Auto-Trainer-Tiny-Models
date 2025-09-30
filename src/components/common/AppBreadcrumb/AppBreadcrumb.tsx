"use client";

import { useModels } from "@/provider/ModelsProvider";
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

  if (!selectedModel) {
    return null;
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            {selectedModel.category}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {selectedModel.name}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}