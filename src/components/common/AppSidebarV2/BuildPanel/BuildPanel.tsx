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
import { TrainerList } from "./TrainerList";
import { TrainerCreatePopup } from "@/components/Train/TrainerCreatePopup";

interface BuildPanelProps {
  className?: string;
  isMobile?: boolean;
}

export const BuildPanel = memo((props: BuildPanelProps) => {
  const { className } = props;
  const router = useRouter();
  const { data, isLoading, error } = useFetchTrainers();

  const handleTrainerClick = (trainer: { id: number }) => {
    router.push(ROUTES.TRAIN_DETAIL(trainer.id));
  };

  const handleTrainerCreated = (trainerId: number) => {
    router.push(ROUTES.TRAIN_DETAIL(trainerId));
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
        <TrainerCreatePopup
          onSuccess={handleTrainerCreated}
          trigger={
            <Button className="w-full" size="default">
              <PlusIcon className="size-4 mr-2" />
              New AI Training Process
            </Button>
          }
        />
      </div>
      <ScrollArea className="flex-1 my-4 -mx-4 px-4 min-h-0">
        <TrainerList
          trainers={data?.data}
          isLoading={isLoading}
          error={error}
          onClick={handleTrainerClick}
        />
      </ScrollArea>
    </div>
  );
});

BuildPanel.displayName = "BuildPanel";