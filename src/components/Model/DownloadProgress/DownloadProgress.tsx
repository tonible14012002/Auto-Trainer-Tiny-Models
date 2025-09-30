import { Progress } from "@/components/ui/progress";
import { formatReadableFileSize } from "@/utils/format";
import type { ModelDetail } from "@/schema/model";

interface DownloadProgressProps {
  model: ModelDetail;
}

export function DownloadProgress({ model }: DownloadProgressProps) {
  // Calculate overall loading progress
  const getLoadingProgress = () => {
    if (!model || !model.loading) return 0;
    const files = Object.values(model.loadFiles);
    if (files.length === 0) return 0;

    const totalBytes = files.reduce((sum, file) => sum + file.total, 0);
    const loadedBytes = files.reduce((sum, file) => sum + file.loaded, 0);

    return totalBytes > 0 ? Math.round((loadedBytes / totalBytes) * 100) : 0;
  };

  const loadingProgress = getLoadingProgress();
  const hasLoadingFiles = model && Object.keys(model.loadFiles).length > 0;

  if (!model?.loading || !hasLoadingFiles) {
    return null;
  }

  return (
    <div className="space-y-3 min-w-[200px]">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">Loading Model</div>
          <div className="text-xs text-muted-foreground">
            {loadingProgress}% complete
            {Object.values(model.loadFiles).some(file => file.total > 0) && (
              <div className="mt-1">
                {formatReadableFileSize(
                  Object.values(model.loadFiles).reduce((sum, file) => sum + file.loaded, 0)
                )} / {formatReadableFileSize(
                  Object.values(model.loadFiles).reduce((sum, file) => sum + file.total, 0)
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-muted-foreground ml-3">
          {Object.values(model.loadFiles).filter(f => f.status === 'done').length} / {Object.keys(model.loadFiles).length} files
        </div>
      </div>
      <Progress
        value={loadingProgress}
        className="h-2"
        indeterminate={loadingProgress === 0}
      />
    </div>
  );
}