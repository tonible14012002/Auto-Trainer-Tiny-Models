import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SidebarListProps {
  children: ReactNode;
  className?: string;
  level?: number; // future use for nested lists
}

export function SidebarList({ children, className, level = 0 }: SidebarListProps) {
  const padLeft = level ? level * 12 : 0; // future use for nested lists
  return (
    <div
      className={cn("space-y-[2px] my-1", className)}
      style={{
        paddingLeft: padLeft,
      }}
    >
      {children}
    </div>
  );
}
