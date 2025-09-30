export const MODEL_WORKER_EVENT = {
  // Send Event
  MAIN: {
    terminate: "TERMINATE",
    init_model: "INIT_MODEL",
    inference: "INFERENCE",
  },
  WORKER: {
    // Receive Event
    worker_ready: "WORKER_READY",
    terminated: "TERMINATED",
    initing: "INITING",
    downloading: "DOWNLOADING",
    downloaded: "DOWNLOADED",
    loaded: "LOADED",
    ready: "READY",
    inference_complete: "INFERENCE_COMPLETE",
    error: "ERROR",
  },
} as const;

export type ModelWorkerEvent =
  (typeof MODEL_WORKER_EVENT.WORKER)[keyof typeof MODEL_WORKER_EVENT.WORKER];

export type ModelMainEvent = (typeof MODEL_WORKER_EVENT.MAIN)[keyof typeof MODEL_WORKER_EVENT.MAIN];

export const MODEL_STATE = {
  IDLE: "IDLE",
  WAITING: "WAITING",
  DOWNLOADING: "DOWNLOADING",
  LOADING: "LOADING",
  READY: "READY",
  INFERENCING: "INFERENCING",
} as const;

// export type ModelState = (typeof MODEL_STATE)[keyof typeof MODEL_STATE];

// export const getNextState = (
//   prevState: ModelState,
//   event: ModelWorkerEvent | ModelMainEvent
// ) => {
//   switch (prevState) {
//     case MODEL_STATE.IDLE:
//         if (event === MODEL_WORKER_EVENT.WORKER.initing) {
//             return MODEL_STATE.WAITING;
//         }
//         break
//     case MODEL_STATE.WAITING:
//     case MODEL_STATE.DOWNLOADING:
//     case MODEL_STATE.LOADING:
//         if (event === MODEL_WORKER_EVENT.WORKER.downloading) {
//             return MODEL_STATE.DOWNLOADING;
//         }
//         if (event === MODEL_WORKER_EVENT.WORKER.downloaded) {
//             return MODEL_STATE.LOADING;
//         }
//         if (event === MODEL_WORKER_EVENT.WORKER.ready) {
//             return MODEL_STATE.READY;
//         }
//         break
//     case MODEL_STATE.READY:
//         if (event === MODEL_WORKER_EVENT.MAIN.inference) {
//             return MODEL_STATE.INFERENCING;
//         }
//         if (event === MODEL_WORKER_EVENT.WORKER.inference_complete) {
//             return MODEL_STATE.READY;
//         }
//   }

//   return prevState
// };
