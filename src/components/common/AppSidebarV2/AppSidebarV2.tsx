"use client";

import { memo } from "react";
import { useAppSidebarContextV2 } from "./AppSidebarProviderV2";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AppSidebarV2Content } from "./AppSidebarV2Content";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export const AppSidebarV2 = memo(() => {
  const isMobile = useIsMobile();
  const { open, setOpen } = useAppSidebarContextV2();

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  if (!isMobile) {
    return (
      <AppSidebarV2Content isMobile={isMobile} className="transition-all" />
    );
  }

  return (
    <Drawer direction="left" open={open} onOpenChange={onOpenChange}>
      <DrawerContent aria-description="okok">
        <DialogTitle className="hidden">Hello World</DialogTitle>
        <DialogDescription className="hidden">
          This is a description for the dialog.
        </DialogDescription>
        <AppSidebarV2Content isMobile={isMobile} />
      </DrawerContent>
    </Drawer>
  );
});

AppSidebarV2.displayName = "AppSidebarV2";
