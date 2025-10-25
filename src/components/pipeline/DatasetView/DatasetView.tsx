"use client";

import React, { ReactNode, useState } from "react";
import { DatasetSample } from "@/schema/schema_v2";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Info, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DatasetPagination } from "./DatasetPagination";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DatasetViewProps<TData = DatasetSample> {
  samples: TData[];
  labelConfig?: Record<string, string>;
  headTitle?: ReactNode;
  tableWrapperClassName?: string;
  customColumns?: ColumnDef<TData, any>[];
  enableSearch?: boolean;
  searchPlaceholder?: string;
  searchFilterFn?: (row: TData, searchValue: string) => boolean;
}

interface FilterState {
  searchQuery: string;
  selectedLabels: Set<number>;
}

const columnHelper = createColumnHelper<DatasetSample>();

// Helper function to highlight search term in text
const HighlightedText: React.FC<{ text: string; searchQuery: string }> = ({
  text,
  searchQuery,
}) => {
  if (!searchQuery.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(
    `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-yellow-200 dark:bg-yellow-800 font-medium"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export const DatasetView = <TData extends Record<string, any> = DatasetSample>({
  samples,
  labelConfig,
  headTitle,
  tableWrapperClassName,
  customColumns,
  enableSearch = true,
  searchPlaceholder = "Search messages...",
  searchFilterFn,
}: DatasetViewProps<TData>) => {
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: "",
    selectedLabels: new Set(),
  });

  // Check if samples have 'label' property (DatasetSample type)
  const hasLabelProperty = React.useMemo(
    () => samples.length > 0 && "label" in samples[0],
    [samples]
  );

  // Calculate label distribution (only for DatasetSample type)
  const labelDistribution = React.useMemo(() => {
    if (!hasLabelProperty) return [];

    const counts: Record<number, number> = {};
    samples.forEach((sample: any) => {
      counts[sample.label] = (counts[sample.label] || 0) + 1;
    });

    const total = samples.length;
    return Object.entries(counts).map(([labelId, count]) => ({
      labelId: Number(labelId),
      labelName: labelConfig?.[labelId] || `Label ${labelId}`,
      count,
      percentage: ((count / total) * 100).toFixed(1),
    }));
  }, [samples, labelConfig, hasLabelProperty]);

  // Initialize selectedLabels with all labels
  React.useEffect(() => {
    if (labelDistribution.length > 0 && filter.selectedLabels.size === 0) {
      setFilter((prev) => ({
        ...prev,
        selectedLabels: new Set(labelDistribution.map((d) => d.labelId)),
      }));
    }
  }, [labelDistribution, filter.selectedLabels.size]);

  // Default columns for DatasetSample
  const defaultColumns = React.useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        id: "index",
        header: "ID",
        cell: (info: any) => {
          return (
            <div className="text-sm text-muted-foreground font-mono">
              {info.row.index + 1}
            </div>
          );
        },
      },
      columnHelper.accessor("msg", {
        header: "Message",
        cell: (info) => {
          const message = info.getValue();
          return (
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <div className="max-w-[300px] text-sm break-words cursor-default">
                  <HighlightedText
                    text={message}
                    searchQuery={filter.searchQuery}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-md break-words">
                <p className="text-xs">{message}</p>
              </TooltipContent>
            </Tooltip>
          );
        },
      }),
      columnHelper.accessor("label", {
        header: () => (
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <span>Label</span>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-1.5">
                <div className="font-semibold text-xs mb-2">
                  Label Distribution
                </div>
                {labelDistribution.map((dist) => (
                  <div
                    key={dist.labelId}
                    className="flex items-center justify-between gap-4 text-xs"
                  >
                    <span className="font-mono">{dist.labelName}</span>
                    <span className="text-muted-foreground">
                      {dist.count} ({dist.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        ),
        cell: (info) => {
          const labelId = info.getValue();
          const labelName =
            labelConfig?.[labelId.toString()] || `Label ${labelId}`;
          return (
            <Badge variant="outline" className="font-mono">
              {labelName}
            </Badge>
          );
        },
      }),
    ],
    [labelConfig, labelDistribution, filter.searchQuery]
  );

  const columns = customColumns || defaultColumns;

  const defaultSearchFilter = React.useCallback(
    (row: any, searchValue: string) => {
      const lowerSearch = searchValue.toLowerCase();

      // Apply label filter
      if (filter.selectedLabels.size > 0 && "label" in row) {
        const labelMatch = filter.selectedLabels.has(row.label);
        if (!labelMatch) return false;
      }

      // If no search query, return true (show all matching label filter)
      if (!searchValue.trim()) return true;

      // Try to search in 'msg' or 'text' fields by default
      if (row.msg) {
        return row.msg.toLowerCase().includes(lowerSearch);
      }
      if (row.text) {
        return row.text.toLowerCase().includes(lowerSearch);
      }
      // Fallback: search in all string values
      return Object.values(row).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(lowerSearch)
      );
    },
    [filter.selectedLabels]
  );

  const table = useReactTable({
    data: samples,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: enableSearch ? getFilteredRowModel() : undefined,
    state: enableSearch
      ? {
          globalFilter: filter,
        }
      : undefined,
    onGlobalFilterChange: enableSearch
      ? (value: any) => {
          if (typeof value === "object" && value.searchQuery !== undefined) {
            setFilter(value);
          }
        }
      : undefined,
    globalFilterFn: enableSearch
      ? (row, _columnId, filterValue: any) => {
          const filterFn = searchFilterFn || defaultSearchFilter;
          const searchValue =
            typeof filterValue === "object"
              ? filterValue.searchQuery
              : filterValue;
          return filterFn(row.original, searchValue || "");
        }
      : undefined,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const pageSize = table.getState().pagination.pageSize;
  const minH = 40 * pageSize;

  return (
    <div className="space-y-3">
      {/* Search and Header */}
      {headTitle}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 md:flex-1">
          {enableSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={filter.searchQuery}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    searchQuery: e.target.value,
                  }))
                }
                className="h-8 w-full pl-8 bg-white"
              />
            </div>
          )}

          {/* Label Filter */}
          {hasLabelProperty && labelDistribution.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-input bg-white"
                >
                  <Filter className="h-4 w-4" />
                  {filter.selectedLabels.size < labelDistribution.length && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 min-w-5 px-1 text-xs"
                    >
                      {filter.selectedLabels.size}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Filter by Label</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        const allSelected =
                          filter.selectedLabels.size ===
                          labelDistribution.length;
                        setFilter((prev) => ({
                          ...prev,
                          selectedLabels: allSelected
                            ? new Set()
                            : new Set(labelDistribution.map((d) => d.labelId)),
                        }));
                      }}
                    >
                      {filter.selectedLabels.size === labelDistribution.length
                        ? "Clear all"
                        : "Select all"}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {labelDistribution.map((dist) => (
                      <div
                        key={dist.labelId}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`label-${dist.labelId}`}
                          checked={filter.selectedLabels.has(dist.labelId)}
                          onCheckedChange={(checked) => {
                            setFilter((prev) => {
                              const newSelected = new Set(prev.selectedLabels);
                              if (checked) {
                                newSelected.add(dist.labelId);
                              } else {
                                newSelected.delete(dist.labelId);
                              }
                              return { ...prev, selectedLabels: newSelected };
                            });
                          }}
                        />
                        <label
                          htmlFor={`label-${dist.labelId}`}
                          className="flex-1 text-sm cursor-pointer flex items-center justify-between"
                        >
                          <span>{dist.labelName}</span>
                          <span className="text-xs text-muted-foreground">
                            ({dist.count})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Pagination Controls */}
        <DatasetPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onPreviousPage={() => table.previousPage()}
          onNextPage={() => table.nextPage()}
          canGoPrevious={table.getCanPreviousPage()}
          canGoNext={table.getCanNextPage()}
        />
      </div>
      <div
        className={cn(
          "border rounded-lg bg-white overflow-x-auto w-full",
          tableWrapperClassName
        )}
        style={{ minHeight: `${minH}px` }}
      >
        <div className="min-w-max">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No samples available
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
