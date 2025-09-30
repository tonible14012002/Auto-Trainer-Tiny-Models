import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SidebarItemProps {
  children: ReactNode;
  leftEl?: ReactNode;
  rightEl?: ReactNode;
  className?: string;
  classNames?: {
    left: string;
    right: string;
  };
  onClick?: () => void;
  isSelected?: boolean;
}

export function SidebarItem({
  children,
  leftEl,
  rightEl,
  className,
  classNames,
  onClick,
  isSelected = false,
}: SidebarItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start text-sm font-medium min-h-[30px] py-0 h-auto min-w-0 text-primary/80",
        {
          "bg-primary/5": isSelected,
        },
        className
      )}
      onClick={onClick}
    >
      {leftEl && <span className={classNames?.left}>{leftEl}</span>}
      <p className="flex-1 text-left line-clamp-2 overflow-hidden">
        {children}
      </p>
      {rightEl && (
        <span className={cn("ml-auto", classNames?.right)}>{rightEl}</span>
      )}
    </Button>
  );
}
