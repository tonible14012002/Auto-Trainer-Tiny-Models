"use client";

import React from "react";
import { TrainerDetail } from "@/schema/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, ChevronRight, AlertCircle, Database, Plus, Info, ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OverviewTabProps {
  trainerDetail: TrainerDetail;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ trainerDetail }) => {
  const [iterationOpen, setIterationOpen] = React.useState(true);
  const [errorLogsOpen, setErrorLogsOpen] = React.useState(false);
  const [metricsExpanded, setMetricsExpanded] = React.useState(false);

  // Mock data - calculate duration from creation
  const startTime = new Date(trainerDetail.createdAt);
  const now = new Date();
  const durationMs = now.getTime() - startTime.getTime();
  const durationMinutes = Math.floor(durationMs / 60000);
  const durationSeconds = Math.floor((durationMs % 60000) / 1000);

  // Parse labels config if available
  const labelsConfig = trainerDetail.activeConfig?.labelsConfig as any;

  // Mock budget calculation
  const budgetLimit = Number(trainerDetail.activeConfig?.budgetLimit) || 100;
  const budgetUsed = Number(trainerDetail.activeConfig?.budgetUsed) || 23.45;
  const budgetPercentage = (budgetUsed / budgetLimit) * 100;

  // Mock label-specific metrics
  const labelMetrics = labelsConfig && Array.isArray(labelsConfig) ? labelsConfig.map((label: any) => ({
    name: label.name,
    accuracy: (Math.random() * 0.15 + 0.85).toFixed(2), // Random 85-100%
    f1Score: (Math.random() * 0.15 + 0.80).toFixed(2), // Random 80-95%
  })) : [];

  return (
    <div className="space-y-3">
      {/* Pipeline Status Card */}
      <Card className="shadow-none p-4 bg-background gap-0">
        {/* Header with Title and Status Info */}
        <div className="grid items-start justify-between grid-rows-2 md:grid-rows-none grid-cols-none md:grid-cols-2 gap-4">
          <div>
            <CardTitle className="text-lg">Pipeline Status</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Real-time training progress and metrics</p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-base font-semibold">
                  {durationMinutes > 0 ? `${durationMinutes}m ${durationSeconds}s` : `${durationSeconds}s`}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Current Iteration</div>
              <div className="text-base font-semibold">3 / 10</div>
            </div>
          </div>
        </div>

        {/* Content Grid: 2x2 layout */}
        <div className="grid grid-rows-2 md:grid-rows-none grid-cols-none md:grid-cols-2 gap-4 mt-4">
          {/* Budget Usage Card */}
          <div className="p-3 border rounded-lg space-y-3">
            <h4 className="text-sm font-semibold">Budget Usage</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Used</span>
                <span className="font-semibold">
                  ${budgetUsed.toFixed(2)} / ${budgetLimit.toFixed(2)}
                </span>
              </div>
              <Progress value={budgetPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {budgetPercentage.toFixed(1)}% used
              </div>
            </div>
          </div>

          {/* Dataset Card with View Button */}
          <div className="p-3 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Current Dataset Amount</div>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                <Database className="w-3 h-3 mr-1.5" />
                View Dataset
              </Button>
            </div>
            <div className="text-lg font-semibold">1,247 samples</div>
          </div>

          {/* Current Metrics Card */}
          <div className="p-3 border rounded-lg bg-muted space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Current Metrics</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setMetricsExpanded(!metricsExpanded)}
              >
                {metricsExpanded ? 'Hide' : 'View More'}
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${metricsExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            <div className="grid grid-rows-2 md:grid-rows-none grid-cols-none md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Overall Accuracy</div>
                <div className="text-lg font-semibold">87.3%</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">F1 Score</div>
                <div className="text-lg font-semibold">0.856</div>
              </div>
            </div>

            {metricsExpanded && labelMetrics.length > 0 && (
              <div className="pt-2 border-t border-muted-foreground/20 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Per-Label Metrics</div>
                {labelMetrics.map((metric: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="font-mono">{metric.name}</span>
                    <div className="flex gap-3">
                      <span className="text-muted-foreground">Acc: {(Number(metric.accuracy) * 100).toFixed(1)}%</span>
                      <span className="text-muted-foreground">F1: {metric.f1Score}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Evaluation Set Card with Add Testcases Button */}
          <div className="p-3 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Current Evaluation Set</div>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                <Plus className="w-3 h-3 mr-1.5" />
                Add Testcases
              </Button>
            </div>
            <div className="text-lg font-semibold">156 testcases</div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Passed: 142</span>
              <span className="text-red-600">Failed: 14</span>
            </div>
          </div>
        </div>

        {/* Label Configuration - Full Width */}
        {labelsConfig && Array.isArray(labelsConfig) && labelsConfig.length > 0 && (
          <div className="p-3 border rounded-lg space-y-2 mt-4">
            <div className="text-xs text-muted-foreground">Label Configuration</div>
            <div className="flex flex-wrap gap-2">
              {labelsConfig.map((label: any, index: number) => (
                <Badge key={index} variant="outline" className="font-mono">
                  {label.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Training Progress Card */}
      <Card className="shadow-none p-0 bg-background">
        <CardContent className="p-0">
          {/* Recent Iteration Summary Section */}
          <Collapsible open={iterationOpen} onOpenChange={setIterationOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 hover:bg-muted/50">
              <ChevronRight className={`w-4 h-4 transition-transform ${iterationOpen ? 'rotate-90' : ''}`} />
              <h3 className="text-sm font-semibold">Recent Iteration Summary</h3>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 space-y-3 bg-muted/10 border-t">
                <div className="grid grid-cols-1 md:grid-rows-2 md:grid-rows-none grid-cols-none md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg space-y-1">
                    <div className="text-sm text-muted-foreground">Iteration</div>
                    <div className="text-sm font-semibold">3 of 10</div>
                  </div>

                  <div className="p-3 border rounded-lg space-y-1">
                    <div className="text-sm text-muted-foreground">Best Accuracy</div>
                    <div className="text-sm font-semibold">87.3%</div>
                  </div>

                  <div className="p-3 border rounded-lg space-y-1">
                    <div className="text-sm text-muted-foreground">Samples Processed</div>
                    <div className="text-sm font-semibold">1,247</div>
                  </div>

                  <div className="p-3 border rounded-lg space-y-1">
                    <div className="text-sm text-muted-foreground">Training Loss</div>
                    <div className="text-sm font-semibold">0.342</div>
                  </div>
                </div>

                <div className="p-3 border rounded-lg space-y-2">
                  <div className="text-sm font-medium">Recent Changes</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Learning rate adjusted to 2e-5</li>
                    <li>• Added 50 new training samples</li>
                    <li>• Improved validation accuracy by 2.1%</li>
                  </ul>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Error Logs Section */}
          <Collapsible open={errorLogsOpen} onOpenChange={setErrorLogsOpen} className="border-t">
            <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 hover:bg-muted/50">
              <ChevronRight className={`w-4 h-4 transition-transform ${errorLogsOpen ? 'rotate-90' : ''}`} />
              <h3 className="text-sm font-semibold flex items-center gap-2">
                Error Logs
                <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                  3 errors
                </Badge>
              </h3>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 space-y-3 bg-muted/10 border-t">
                <div className="p-3 border border-red-200 rounded-lg bg-red-50/50 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-medium text-red-900">Test case failed: edge_case_001</div>
                      <div className="text-xs text-red-700 font-mono">Expected output: &quot;positive&quot;, Got: &quot;negative&quot;</div>
                      <div className="text-xs text-muted-foreground">Iteration 2 • 5 minutes ago</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 border border-red-200 rounded-lg bg-red-50/50 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-medium text-red-900">Test case failed: special_chars_test</div>
                      <div className="text-xs text-red-700 font-mono">TypeError: Cannot read property &apos;length&apos; of undefined</div>
                      <div className="text-xs text-muted-foreground">Iteration 3 • 2 minutes ago</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 border border-red-200 rounded-lg bg-red-50/50 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-medium text-red-900">Test case failed: long_text_input</div>
                      <div className="text-xs text-red-700 font-mono">Confidence score below threshold: 0.42</div>
                      <div className="text-xs text-muted-foreground">Iteration 3 • 1 minute ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
};
