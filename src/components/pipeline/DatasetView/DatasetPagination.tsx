"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatasetPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const getPageNumbers = (
  currentPage: number,
  totalPages: number
): (number | string)[] => {
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    pages.push(totalPages);
  }

  return pages;
};

export const DatasetPagination: React.FC<DatasetPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onPreviousPage,
  onNextPage,
  canGoPrevious,
  canGoNext,
}) => {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onPreviousPage}
        disabled={!canGoPrevious}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-muted-foreground"
            >
              ...
            </span>
          );
        }

        const pageNumber = page as number;
        const isActive = pageNumber === currentPage;

        return (
          <Button
            key={pageNumber}
            variant={isActive ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onNextPage}
        disabled={!canGoNext}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
