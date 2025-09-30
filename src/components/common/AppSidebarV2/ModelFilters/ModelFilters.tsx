"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { FilterIcon, XIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { FilterValues } from "./types";

interface ModelFiltersProps {
  value: FilterValues;
  onChange: (filters: FilterValues) => void;
}

export const ModelFilters = memo(({ value, onChange }: ModelFiltersProps) => {
  const hasActiveFilters = value.showLoadedOnly || value.searchQuery.trim();

  const handleShowLoadedOnlyChange = (checked: boolean) => {
    onChange({
      ...value,
      showLoadedOnly: checked,
    });
  };

  const handleClearFilters = () => {
    onChange({
      showLoadedOnly: false,
      searchQuery: "",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            hasActiveFilters && "bg-accent text-accent-foreground"
          )}
        >
          <FilterIcon className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Filters</h4>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <XIcon className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value.showLoadedOnly}
                onChange={(e) => handleShowLoadedOnlyChange(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Loaded models only</span>
            </label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

ModelFilters.displayName = "ModelFilters";