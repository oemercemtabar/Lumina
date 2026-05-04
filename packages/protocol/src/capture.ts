export interface PoseVector {
  yaw: number;
  pitch: number;
  roll: number;
}

export interface CaptureFrameMeta {
  type: "frame.meta";
  sessionId: string;
  timestampMs: number;
  pose: PoseVector;
  trackingConfidence: number;
  blurScore: number;
  exposureScore: number;
  noveltyScore: number;
}

export interface CaptureFrameChunk {
  type: "frame.chunk";
  sessionId: string;
  frameId: string;
  chunkIndex: number;
  chunkCount: number;
  mimeType: "image/jpeg" | "image/webp";
  payloadBase64: string;
}
