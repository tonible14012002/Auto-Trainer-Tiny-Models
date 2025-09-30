"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Lightbulb } from "lucide-react";
import { ExamplePromptsList } from "../ExamplePromptsList";
import { type TaskWithExamples } from "@/constants/model";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useState } from "react";

interface ExamplePromptsPopoverProps {
  currentTask?: TaskWithExamples;
  onSelectPrompt?: (prompt: string) => void;
  triggerEl?: React.ReactNode;
}

export const ExamplePromptsPopover = ({
  currentTask,
  onSelectPrompt,
  triggerEl,
}: ExamplePromptsPopoverProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const onMobileSelectPrompt = (pmpt: string) => {
    setIsOpen(false);
    onSelectPrompt?.(pmpt);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Lightbulb className="h-4 w-4" />
      Examples
    </Button>
  );

  const trigger = triggerEl || defaultTrigger;

  if (!isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 max-w-md" align="end">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Example Prompts</h4>
            <p className="text-xs text-muted-foreground">
              Click on any example to paste it into the form
            </p>
            <ExamplePromptsList
              currentTask={currentTask}
              onSelectPrompt={onSelectPrompt}
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4 space-y-2">
          <h4 className="font-medium text-sm">Example Prompts</h4>
          <p className="text-xs text-muted-foreground">
            Click on any example to paste it into the form
          </p>
          <ExamplePromptsList
            currentTask={currentTask}
            onSelectPrompt={onMobileSelectPrompt}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
