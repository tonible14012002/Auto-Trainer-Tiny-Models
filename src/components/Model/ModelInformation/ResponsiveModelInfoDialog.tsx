"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResponsiveModelInfoDialogProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveModelInfoDialog({
  trigger,
  title,
  description,
  children,
  className,
}: ResponsiveModelInfoDialogProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {trigger}
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5" />
              {title}
            </DrawerTitle>
            {description && (
              <DrawerDescription>
                {description}
              </DrawerDescription>
            )}
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className={cn("max-w-2xl max-h-[80vh] overflow-y-auto", className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5" />
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}