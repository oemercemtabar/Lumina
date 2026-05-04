export interface TargetPose {
  yaw: number;
  pitch: number;
  roll: number;
}

export interface CaptureFrameEnvelope {
  type: "frame.meta";
  sessionId: string;
  timestampMs: number;
  pose: TargetPose;
  trackingConfidence: number;
  blurScore: number;
  exposureScore: number;
  noveltyScore: number;
}

export interface NextPoseDirective {
  type: "directive.next_pose";
  message: string;
  targetPose: TargetPose;
  holdMs: number;
  captureNow: boolean;
  reasonCodes: string[];
}

export type DirectorServerEvent = NextPoseDirective;
