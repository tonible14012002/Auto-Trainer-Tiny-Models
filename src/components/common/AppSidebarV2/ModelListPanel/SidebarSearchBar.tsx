"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SidebarSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const SidebarSearchBar = ({
  placeholder = "Search by models, tasks...",
  onSearch,
  className,
}: SidebarSearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (value: string) => {
    setQuery(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className={cn("pl-8 !text-sm")}
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
