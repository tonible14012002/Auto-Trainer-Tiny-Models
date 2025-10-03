"use client";

import React from "react";
import { TrainerDetail } from "@/schema/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, PlayCircle, Trash2 } from "lucide-react";
import { OverviewTab } from "./OverviewTab";
import { DatasetTab } from "./DatasetTab";
import { IterationTab } from "./IterationTab";
import { AnalyzeTab } from "./AnalyzeTab";
import { AppBreadcrumb } from "@/components/common/AppBreadcrumb";

interface TrainerPipelineViewProps {
  trainerDetail: TrainerDetail;
}

export const TrainerPipelineView: React.FC<TrainerPipelineViewProps> = ({
  trainerDetail,
}) => {
  return (
    <div className="max-w p-4 pb-8 overflow-y-auto">
      <AppBreadcrumb className="mb-4"/>
      <Tabs defaultValue="overview" className="max-w-[900px] mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {trainerDetail.name || "Unnamed Trainer"}
          </h1>
          <div className="flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dataset">Dataset</TabsTrigger>
              <TabsTrigger value="iteration">Iteration</TabsTrigger>
              <TabsTrigger value="analyze">Analyze</TabsTrigger>
            </TabsList>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Re-run All
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="max-w-[900px] mx-auto w-full">
          <TabsContent value="overview">
            <OverviewTab trainerDetail={trainerDetail} />
          </TabsContent>
          <TabsContent value="dataset">
            <DatasetTab trainerDetail={trainerDetail} />
          </TabsContent>
          <TabsContent value="iteration">
            <IterationTab trainerDetail={trainerDetail} />
          </TabsContent>
          <TabsContent value="analyze">
            <AnalyzeTab trainerDetail={trainerDetail} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
