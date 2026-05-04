export interface DesktopRuntimeInfo {
  platform: string;
  arch: string;
  appVersion: string;
}

export interface SessionInitPayload {
  sessionId: string;
  createdAt: string;
  mode: "neutral-head-v1";
  device: string;
}

export interface SaveFramePayload {
  sessionId: string;
  frameId: string;
  poseId: string;
  capturedAt: string;
  imageBase64: string;
  metrics: {
    tracking: number;
    sharpness: number;
    exposure: number;
    novelty: number;
  };
}

declare global {
  interface Window {
    luminaDesktop?: {
      getRuntimeInfo: () => Promise<DesktopRuntimeInfo>;
      createSession: (session: SessionInitPayload) => Promise<{
        sessionDir: string;
        manifestPath: string;
      }>;
      saveFrame: (payload: SaveFramePayload) => Promise<{ framePath: string }>;
      completeSession: (payload: {
        sessionId: string;
        completedAt: string;
        summary: {
          acceptedFrames: number;
          completedPoses: number;
        };
      }) => Promise<{ manifestPath: string }>;
    };
  }
}

export {};
