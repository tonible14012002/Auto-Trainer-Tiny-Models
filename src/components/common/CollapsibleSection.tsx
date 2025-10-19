"use client";

import { useState, ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface CollapsibleSectionProps {
  /**
   * The header content - can be a string or custom React elements
   */
  header: ReactNode;
  /**
   * The collapsible content
   */
  children: ReactNode;
  /**
   * Whether the section is open by default
   */
  defaultOpen?: boolean;
  /**
   * Size of the chevron icon
   */
  chevronSize?: number;
  /**
   * Additional className for the header container
   */
  headerClassName?: string;
  /**
   * Additional className for the content wrapper
   */
  contentClassName?: string;
  /**
   * Max height value when expanded (e.g., "10000px", "2000px")
   */
  maxHeight?: string;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
}

export const CollapsibleSection = ({
  header,
  children,
  defaultOpen = true,
  chevronSize = 14,
  headerClassName = "",
  contentClassName = "",
  maxHeight = "10000px",
  onOpenChange,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  return (
    <div className="min-w-0">
      {/* Header */}
      <div
        className={`cursor-pointer hover:bg-muted/50 transition-colors ${headerClassName}`}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-3">
          <ChevronRight
            size={chevronSize}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
          <div className="flex items-center gap-3 flex-1">{header}</div>
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? `opacity-100` : "max-h-0 opacity-0"
        } ${contentClassName}`}
        style={{
          maxHeight: isOpen ? maxHeight : "0",
        }}
      >
        {children}
      </div>
    </div>
  );
};
