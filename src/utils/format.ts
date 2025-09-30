


export const formatReadableFileSize = (size?: number) => {
  if (!size) return "0B";
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const convertedSize = size / Math.pow(1024, i)
  if (convertedSize % 1 === 0) {
    return `${convertedSize} ${["B", "KB", "MB", "GB"][i]}`;
  }
  return `${convertedSize.toFixed(2)} ${["B", "kB", "MB", "GB"][i]}`;
};


export const formatReadableDurationInMs = (duration?: number) => {
  if (!duration) return "0ms";
  const display = Math.round(duration * 100) / 100;
  return `${display} ms`;
};