import { create } from "zustand";

export interface PoseStep {
  id: string;
  label: string;
  instruction: string;
  detail: string;
  holdMs: number;
}

export interface QualitySnapshot {
  tracking: number;
  sharpness: number;
  exposure: number;
  novelty: number;
}

interface AcceptedFrameRecord {
  frameId: string;
  poseId: string;
  savedPath?: string;
}

interface CaptureStore {
  sessionId: string | null;
  sessionDir: string | null;
  captureState: "idle" | "starting" | "capturing" | "completed" | "error";
  errorMessage: string | null;
  poseSequence: PoseStep[];
  currentPoseIndex: number;
  acceptedFrames: AcceptedFrameRecord[];
  quality: QualitySnapshot;
  statusMessage: string;
  countdownMs: number;
  setSessionInfo: (sessionId: string, sessionDir: string) => void;
  setCaptureState: (captureState: CaptureStore["captureState"]) => void;
  setError: (errorMessage: string | null) => void;
  setQuality: (quality: QualitySnapshot) => void;
  setStatusMessage: (statusMessage: string) => void;
  setCountdownMs: (countdownMs: number) => void;
  advancePose: (frame: AcceptedFrameRecord) => void;
  retryPose: () => void;
  resetSession: () => void;
}

export const poseSequence: PoseStep[] = [
  {
    id: "front",
    label: "Front",
    instruction: "Face the camera directly and keep your expression neutral.",
    detail: "This frame anchors identity and frontal texture.",
    holdMs: 1200
  },
  {
    id: "front-left",
    label: "Front Left",
    instruction: "Turn slightly left, around 20 degrees.",
    detail: "Keep eyes on screen and hold your jaw relaxed.",
    holdMs: 1200
  },
  {
    id: "left",
    label: "Left",
    instruction: "Turn further left to show the side of your head.",
    detail: "Include ear and rough hair silhouette coverage.",
    holdMs: 1200
  },
  {
    id: "front-right",
    label: "Front Right",
    instruction: "Return through center and turn slightly right.",
    detail: "Match the left-side angle for balanced coverage.",
    holdMs: 1200
  },
  {
    id: "right",
    label: "Right",
    instruction: "Turn further right to expose the full side profile.",
    detail: "Keep motion low so the outline stays sharp.",
    holdMs: 1200
  },
  {
    id: "chin-up",
    label: "Chin Up",
    instruction: "Lift your chin slightly without changing expression.",
    detail: "This helps with underside coverage and the crown transition.",
    holdMs: 1400
  }
];

const defaultQuality: QualitySnapshot = {
  tracking: 0,
  sharpness: 0,
  exposure: 0,
  novelty: 0
};

const initialState = {
  sessionId: null,
  sessionDir: null,
  captureState: "idle" as const,
  errorMessage: null,
  poseSequence,
  currentPoseIndex: 0,
  acceptedFrames: [],
  quality: defaultQuality,
  statusMessage: "Ready to start a neutral head capture session.",
  countdownMs: 0
};

export const useCaptureStore = create<CaptureStore>((set) => ({
  ...initialState,
  setSessionInfo: (sessionId, sessionDir) => set({ sessionId, sessionDir }),
  setCaptureState: (captureState) => set({ captureState }),
  setError: (errorMessage) => set({ errorMessage }),
  setQuality: (quality) => set({ quality }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
  setCountdownMs: (countdownMs) => set({ countdownMs }),
  advancePose: (frame) =>
    set((state) => {
      const nextIndex = Math.min(state.currentPoseIndex + 1, state.poseSequence.length);
      return {
        acceptedFrames: [...state.acceptedFrames, frame],
        currentPoseIndex: nextIndex,
        captureState: nextIndex >= state.poseSequence.length ? "completed" : "capturing",
        countdownMs: 0
      };
    }),
  retryPose: () => set({ countdownMs: 0 }),
  resetSession: () => set(initialState)
}));
