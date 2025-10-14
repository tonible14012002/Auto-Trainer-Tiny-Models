"use client";

import React, { ReactNode } from "react";
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
import { Search, Info } from "lucide-react";
import { DatasetPagination } from "./DatasetPagination";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DatasetViewProps {
  samples: DatasetSample[];
  labelConfig?: Record<string, string>;
  headTitle?: ReactNode;
  tableWrapperClassName?: string;
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

  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
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

export const DatasetView: React.FC<DatasetViewProps> = ({
  samples,
  labelConfig,
  headTitle,
  tableWrapperClassName,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Calculate label distribution
  const labelDistribution = React.useMemo(() => {
    const counts: Record<number, number> = {};
    samples.forEach((sample) => {
      counts[sample.label] = (counts[sample.label] || 0) + 1;
    });

    const total = samples.length;
    return Object.entries(counts).map(([labelId, count]) => ({
      labelId: Number(labelId),
      labelName: labelConfig?.[labelId] || `Label ${labelId}`,
      count,
      percentage: ((count / total) * 100).toFixed(1),
    }));
  }, [samples, labelConfig]);

  const columns = React.useMemo<ColumnDef<DatasetSample, any>[]>(
    () => [
      columnHelper.accessor("msg", {
        header: "Message",
        cell: (info) => {
          const message = info.getValue();
          return (
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <div className="max-w-xl text-sm break-words overflow-hidden cursor-default">
                  <HighlightedText text={message} searchQuery={searchQuery} />
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
    [labelConfig, labelDistribution, searchQuery]
  );

  const table = useReactTable({
    data: samples,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const message = row.original.msg.toLowerCase();
      return message.includes(searchValue);
    },
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
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-64 pl-8"
          />
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
        className={cn("border rounded-lg bg-white", tableWrapperClassName)}
        style={{ minHeight: `${minH}px` }}
      >
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
  );
};
