import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef, type ReactNode } from "react";

interface SidebarLabelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  isHighlighted?: boolean;
}

export const SidebarLabel = forwardRef<HTMLButtonElement, SidebarLabelProps>(
  ({ children, className, isHighlighted, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        className={cn(
        "sidebar-label w-full justify-start !text-xs h-[30px] font-medium",
        isHighlighted
          ? "text-foreground bg-accent/50"
          : "text-muted-foreground",
        className
      )}
        {...props}
    >
      {children}
    </Button>
  );
});

SidebarLabel.displayName = "SidebarLabel";
