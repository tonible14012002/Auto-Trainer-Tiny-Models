"use client";

import { Button } from "@/components/ui/button";
import { PanelLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface EmptyStateProps {
  className?: string;
  onOpenSidebar?: () => void;
}

export const EmptyState = memo(({ className, onOpenSidebar }: EmptyStateProps) => {
  return (
    <div className={cn("h-full flex items-center justify-center p-4", className)}>
      <div className="flex flex-col items-center text-center max-w-md">
        <h2 className="text-lg md:text-2xl font-semibold mb-2">Welcome to Tiny Model Playground</h2>
        <p className="text-xs md:text-sm text-muted-foreground mb-6 max-w-sm">
          Select a model from the sidebar to start experimenting with AI inference. 
          Choose from various tasks like sentiment analysis, summarization, and more.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onOpenSidebar}
            className="md:hidden"
            variant="default"
            size="sm"
          >
            <PanelLeftIcon />
            Open Sidebar
          </Button>
        </div>
      </div>
    </div>
  );
});

EmptyState.displayName = "EmptyState";
