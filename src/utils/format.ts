
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with duration and relativeTime plugins
dayjs.extend(duration);
dayjs.extend(relativeTime);

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

/**
 * Formats a duration between two timestamps into a human-readable format
 * @param startTimestamp - Start timestamp (ISO string or Date)
 * @param endTimestamp - End timestamp (ISO string or Date), defaults to current time
 * @returns Formatted duration string (e.g., "2h 30m", "45m", "3d 4h")
 */
export const formatDuration = (
  startTimestamp: string | Date,
  endTimestamp?: string | Date
): string => {
  const start = dayjs(startTimestamp);
  const end = endTimestamp ? dayjs(endTimestamp) : dayjs();

  if (!start.isValid() || !end.isValid()) {
    return "0m";
  }

  const durationMs = end.diff(start);
  const dur = dayjs.duration(durationMs);

  const days = Math.floor(dur.asDays());
  const hours = dur.hours();
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  // Format based on duration length
  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  } else if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Formats a duration in milliseconds into a human-readable format
 * @param durationMs - Duration in milliseconds
 * @returns Formatted duration string (e.g., "2h 30m", "45m", "3d 4h")
 */
export const formatDurationFromMs = (durationMs: number): string => {
  if (!durationMs || durationMs < 0) {
    return "0m";
  }

  const dur = dayjs.duration(durationMs);

  const days = Math.floor(dur.asDays());
  const hours = dur.hours();
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  // Format based on duration length
  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  } else if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};