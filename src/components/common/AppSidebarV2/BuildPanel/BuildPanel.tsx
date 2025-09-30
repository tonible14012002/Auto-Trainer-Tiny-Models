"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo } from "react";
import { BuildSearchBar } from "./BuildSearchBar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { useFetchTrainers } from "@/hooks/trainer/useFetchTrainers";
import { TrainerItem } from "./TrainerItem";

interface BuildPanelProps {
  className?: string;
  isMobile?: boolean;
}

export const BuildPanel = memo((props: BuildPanelProps) => {
  const { className } = props;
  const router = useRouter();
  const { data, isLoading, error } = useFetchTrainers();

  const handleCreateClick = () => {
    router.push(ROUTES.TRAIN_CREATE);
  };

  const handleTrainerClick = (trainer: { id: number }) => {
    router.push(`${ROUTES.TRAIN_DETAIL}/${trainer.id}`);
  };

  return (
    <div
      className={cn(
        "p-4 border-r flex flex-col min-h-0",
        className
      )}
    >
      <div className="space-y-3">
        <BuildSearchBar />
        <Button className="w-full" size="default" onClick={handleCreateClick}>
          <PlusIcon className="size-4 mr-2" />
          New AI Training Process
        </Button>
      </div>
      <ScrollArea className="flex-1 my-4 -mx-4 px-4 min-h-0">
        <div className="space-y-2">
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading trainers...
            </p>
          )}
          {error && (
            <p className="text-sm text-destructive text-center py-4">
              Failed to load trainers
            </p>
          )}
          {data?.data && data.data.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No trainers found
            </p>
          )}
          {data?.data?.map((trainer) => (
            <TrainerItem
              key={trainer.id}
              trainer={trainer}
              onClick={handleTrainerClick}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});

BuildPanel.displayName = "BuildPanel";