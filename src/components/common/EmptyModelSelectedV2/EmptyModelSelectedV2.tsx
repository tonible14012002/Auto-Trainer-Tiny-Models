"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAppSidebarContextV2 } from "@/components/common/AppSidebarV2/AppSidebarProviderV2";
import { Menu } from "lucide-react";

export const EmptyModelSelectedV2 = () => {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useAppSidebarContextV2();

  return (
    <div className="flex flex-col items-center justify-center h-full mt-16 px-4">
      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-xl font-semibold text-foreground">
          Pick a Model
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose a model from the sidebar to start performing inference tasks like summarization, sentiment analysis, and more.
        </p>

        {isMobile && (
          <Button
            onClick={toggleSidebar}
            variant="outline"
            className="mt-6"
          >
            <Menu className="w-4 h-4 mr-2" />
            Open Model List
          </Button>
        )}
      </div>
    </div>
  );
};