"use client";

import { useModels } from "@/provider/ModelsProvider";
import { useParams, usePathname } from "next/navigation";
import { TrainerParams } from "@/constants/routes";
import { TrainerBreadcrumb } from "./TrainerBreadcrumb";
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
  const params = useParams<TrainerParams>();

  // Check if current page is a trainer page
  const isTrainerPage = pathname?.startsWith("/train/");

  if (isTrainerPage && params?.trainerId) {
    return <TrainerBreadcrumb className={className} />;
  }

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