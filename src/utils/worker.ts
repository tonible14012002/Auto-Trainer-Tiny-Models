import type { WorkerMessage } from "@/schema/model";

export const makeMessage = <T = any>(msg: WorkerMessage<T>) => {
  return msg;
};

export const startTimer = (
  timerRef: Record<string, { begin?: number; end?: number; duration?: number }>,
  key: string
) => {
  const now = performance.now();
  timerRef[key] = {
    begin: now,
    end: now,
    duration: 0,
  };
};

export const endTimer = (
  timerRef: Record<string, { begin?: number; end?: number; duration?: number }>,
  key: string
) => {
  const now = performance.now();
  if (!timerRef[key] || !timerRef[key].begin) {
    throw new Error(`Timer with key "${key}" does not exist.`);
  }

  timerRef[key].end = now;

  const duration = timerRef[key].end - timerRef[key].begin;
  timerRef[key].duration = duration;
  return duration;
};
