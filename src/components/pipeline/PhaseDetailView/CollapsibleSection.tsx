"use client";

import { ReactNode } from "react";
import { ChevronRight, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CollapsibleSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
  children: ReactNode;
}

export const CollapsibleSection = ({
  title,
  description,
  icon: Icon,
  iconColor,
  isOpen,
  onToggle,
  badge,
  children,
}: CollapsibleSectionProps) => {
  return (
    <div className="border rounded-lg bg-white">
      <div
        className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <ChevronRight
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <div className="flex-1">
          <h3 className="font-semibold text-base">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 border-t">{children}</div>
      </div>
    </div>
  );
};
