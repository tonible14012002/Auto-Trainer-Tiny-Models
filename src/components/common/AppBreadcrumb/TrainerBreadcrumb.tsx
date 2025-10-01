"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TrainerParams } from "@/constants/routes";
import { useParams } from "next/navigation";
import { useFetchTrainers } from "@/hooks/trainer/useFetchTrainers";
import { useMemo } from "react";

interface TrainerBreadcrumbProps {
  className?: string;
}

export function TrainerBreadcrumb({ className}: TrainerBreadcrumbProps) {
  const { trainerId } = useParams<TrainerParams>();
  const { data } = useFetchTrainers();

  const trainerName = useMemo(() => {
    if (!data?.data || !trainerId) return trainerId;

    const trainer = data.data.find(t => t.id === Number(trainerId));
    return trainer?.name || trainerId;
  }, [data?.data, trainerId]);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            Trainers
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {trainerName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
