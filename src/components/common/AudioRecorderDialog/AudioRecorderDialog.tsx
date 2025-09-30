"use client";

import { type ReactNode, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AudioRecorder } from "../AudioRecorder/AudioRecorder";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AudioRecorderDialogProps {
  trigger: ReactNode;
  onRecordFinish?: (audioBlob: Blob) => void;
  contentClassName?: string;
  align?: "start" | "center" | "end";
}

export const AudioRecorderDialog = ({
  trigger,
  onRecordFinish,
  contentClassName = "",
}: AudioRecorderDialogProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const handleRecordFinish = (audioBlob: Blob) => {
    setIsOpen(false);
    onRecordFinish?.(audioBlob);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className={`w-full max-w-sm ${contentClassName}`}>
          <DialogHeader>
            <DialogTitle>Record Audio</DialogTitle>
          </DialogHeader>
          <AudioRecorder onRecordFinish={handleRecordFinish} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={contentClassName}>
        <DrawerHeader>
          <DrawerTitle>
            Record Audio
          </DrawerTitle>
        </DrawerHeader>
        <AudioRecorder onRecordFinish={handleRecordFinish} />
      </DrawerContent>
    </Drawer>
  );
};
