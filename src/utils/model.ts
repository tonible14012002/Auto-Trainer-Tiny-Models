import type { FileLoadInfo, WorkerMessage } from "@/schema/model";

export const getTotalFileInfo = (
  fileLoadInfo: Record<string, FileLoadInfo>
) => {
  const files = Object.values(fileLoadInfo);
  const totalSize = files.reduce((acc, file) => acc + file.total, 0);
  const loadedSize = files.reduce((acc, file) => acc + file.loaded, 0);
  const totalDownloadTime = files.reduce((acc, file) => acc + file.duration, 0);

  return {
    totalSize,
    loadedSize,
    totalDownloadTime,
  };
};

export const loadStatusFromWorkerData = (data: WorkerMessage["data"]) => {
  const timeTrack = data?.timeTrack;
  return {
    fileStatus: Object.keys(data.loadStatus).reduce((acc, file) => {
      acc[file] = {
        ...data.loadStatus[file],
        duration: timeTrack[file]?.duration || 0,
      };
      return acc;
    }, {} as Record<string, FileLoadInfo>),
    loadTime:
      Math.round((timeTrack.modelLoadTime?.duration ?? 0) * 100) / 100 || 0,
  };
};