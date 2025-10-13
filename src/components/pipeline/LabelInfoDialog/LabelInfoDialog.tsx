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
import { LabelConfigDetail } from "@/schema/schema_v2";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface LabelInfoDialogProps {
  labelConfig: LabelConfigDetail;
  trigger: React.ReactNode;
}

export function LabelInfoDialog({ labelConfig, trigger }: LabelInfoDialogProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const content = (
    <div className="space-y-4">
      {/* Label Configuration Name */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Configuration Name</h3>
        <p className="text-sm text-muted-foreground">{labelConfig.name}</p>
      </div>

      {/* ID to Label Mapping */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">ID to Label Mapping</h3>
        <div className="space-y-1.5">
          {Object.entries(labelConfig.id2label).map(([id, label]) => (
            <div key={id} className="flex items-center gap-2 text-sm">
              <Badge variant="secondary" className="font-mono text-xs">
                {id}
              </Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="outline" className="font-mono">
                {label}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Label to ID Mapping */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Label to ID Mapping</h3>
        <div className="space-y-1.5">
          {Object.entries(labelConfig.label2id).map(([label, id]) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="font-mono">
                {label}
              </Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {id}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Label Explanations */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Label Explanations</h3>
        <div className="space-y-3">
          {Object.entries(labelConfig.label_explanation).map(([label, explanation]) => (
            <div key={label} className="space-y-1 p-2.5 border rounded-lg">
              <Badge variant="outline" className="font-mono">
                {label}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">{explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Label Configuration Details
            </DrawerTitle>
            <DrawerDescription>
              View detailed information about the label configuration
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Label Configuration Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about the label configuration
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
