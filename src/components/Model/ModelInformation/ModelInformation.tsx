import { Button } from "@/components/ui/button";
import { InfoIcon, ExternalLinkIcon } from "lucide-react";
import type { ModelDetail } from "@/schema/model";
import { cn } from "@/lib/utils";
import { formatReadableFileSize } from "@/utils/format";
import { ResponsiveModelInfoDialog } from "./ResponsiveModelInfoDialog";

interface ModelInformationProps {
  model: ModelDetail;
  className?: string;
}

export function ModelInformation({ model, className }: ModelInformationProps) {
  const trigger = (
    <Button
      variant="outline"
      size="sm"
      className={cn("gap-2", className)}
    >
      <InfoIcon className="h-4 w-4" />
      Model Info
    </Button>
  );

  console.log(model.loadFiles)

  return (
    <ResponsiveModelInfoDialog
      trigger={trigger}
      title={model.name}
    >
      <div className="space-y-6">
          {/* Description */}
          {model.metadata?.description && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Description</h3>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {model.metadata.description}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Model Path</div>
                <div className="text-sm font-mono bg-muted px-2 py-1 rounded text-foreground break-all">
                  {model.modelPath}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Category</div>
                <div className="text-sm text-foreground">{model.category}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Task Type</div>
                <div className="text-sm text-foreground capitalize">
                  {model.task.replace(/-/g, ' ')}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Data Type</div>
                <div className="text-sm font-mono text-foreground">
                  {model.dtype || 'auto'}
                </div>
              </div>

              {model.metadata?.modelSize && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">Model Size</div>
                  <div className="text-sm text-foreground">
                    {model.metadata.modelSize}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Current Status</div>
                <div className="text-sm">
                  {model.loading ? (
                    <span className="text-amber-600 font-medium">Loading...</span>
                  ) : model.loaded ? (
                    <span className="text-green-600 font-medium">Ready</span>
                  ) : (
                    <span className="text-muted-foreground">Not loaded</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Load Time</div>
                <div className="text-sm text-foreground">
                  {model.loadTime ? `${model.loadTime}ms` : 'Not available'}
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          {model.config && Object.keys(model.config).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Configuration</h3>
              <div className="bg-muted rounded-lg p-3">
                <pre className="text-xs text-foreground font-mono overflow-x-auto">
                  {JSON.stringify(model.config, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Load Files Information */}
          {Object.keys(model.loadFiles).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Downloaded Files</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {Object.entries(model.loadFiles).map(([key, fileInfo]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-foreground truncate">{fileInfo.file}</div>
                      <div className="text-muted-foreground">
                        {fileInfo.loaded > 0
                          ? `${formatReadableFileSize(fileInfo.loaded)} / ${formatReadableFileSize(fileInfo.total)}`
                          : fileInfo.total
                            ? `0 / ${formatReadableFileSize(fileInfo.total)}`
                            : 'Not loaded'
                        }
                      </div>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      fileInfo.status === 'done' ? 'bg-green-100 text-green-800' :
                      fileInfo.status === 'progress' ? 'bg-blue-100 text-blue-800' :
                      fileInfo.status === 'download' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {fileInfo.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Link */}
          {model.metadata?.huggingfaceUrl && (
            <div className="pt-4 border-t">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <a
                  href={model.metadata.huggingfaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon className="h-4 w-4" />
                  View on HuggingFace
                </a>
              </Button>
            </div>
          )}
        </div>
    </ResponsiveModelInfoDialog>
  );
}