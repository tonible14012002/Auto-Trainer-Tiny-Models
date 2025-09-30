"use client";

import { ModelGroup } from "@/components/Model/ModelGroup";
import { ModelList } from "@/components/Model/ModelList";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ModelDetail } from "@/schema/model";
import { useState, memo } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ModelAddPopup } from "@/components/Model/ModelAddPopup";

interface AppSidebarProps {
  models: ModelDetail[];
  selectedModelId?: string;
  onSelectModel: (_: string) => void;
  className?: string;
  open?: boolean;
  onOpenChange?: (_: boolean) => void;
}

export const AppSidebar = memo((props: AppSidebarProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const onSelectModel = (modelId: string) => {
    props.onSelectModel(modelId);
    props.onOpenChange?.(false);
    setIsOpen(false);
  };
  const open = props.open === undefined ? isOpen : props.open;
  const onOpenChange = (open: boolean) => {
    props.onOpenChange?.(open);
    setIsOpen(open);
  };

  const onToggleSidebar = () => {
    onOpenChange(!open);
  };

  if (!isMobile) {
    return (
      <AppSidebarContent
        models={props.models}
        onSelectModel={props.onSelectModel}
        className="transition-all"
        selectedModelId={props.selectedModelId}
      />
    );
  }

  return (
    <>
      {/* Placeholder for grids */}
      <div className="border-r flex flex-col items-center pt-4">
        <Button size="icon" variant="secondary" onClick={onToggleSidebar}>
          <PanelLeftIcon />
        </Button>
        <Drawer direction="left" open={open} onOpenChange={onOpenChange}>
          <div>
            <DrawerContent aria-description="okok">
              <DialogTitle className="hidden">Hello World</DialogTitle>
              <DialogDescription className="hidden">
                This is a description for the dialog.
              </DialogDescription>
              <AppSidebarContent
                models={props.models}
                onSelectModel={onSelectModel}
                selectedModelId={props.selectedModelId}
              />
            </DrawerContent>
          </div>
        </Drawer>
      </div>
    </>
  );
});

AppSidebar.displayName = "AppSidebar";

export const AppSidebarContent = memo(({
  models,
  onSelectModel,
  className = "",
  selectedModelId,
}: AppSidebarProps) => {
  return (
    <div className={cn("p-4 border-r flex flex-col min-h-0", className)}>
      <h3 className="font-bold text-xl tracking-tight">Proof of Concept</h3>
      <p className="text-xs text-muted-foreground">Training Tiny Models</p>
      <div className="mt-8">
        <ModelAddPopup
          trigger={
            <Button size="sm">
              <Plus />
              Add Custom Model
            </Button>
          }
        />
      </div>
      <ScrollArea className="flex-1 mt-8 -mx-4 px-4 min-h-0">
        <ModelGroup
          title="Transformer.Js"
          listEl={
            <ModelList
              modelDetails={models}
              onSelectModel={onSelectModel}
              selectedModelId={selectedModelId}
            />
          }
        />
      </ScrollArea>
    </div>
  );
});

AppSidebarContent.displayName = "AppSidebarContent";
