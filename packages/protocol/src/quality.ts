import type { PoseVector } from "./capture";

export interface NextPoseDirective {
  type: "directive.next_pose";
  message: string;
  targetPose: PoseVector;
  holdMs: number;
  captureNow: boolean;
  reasonCodes: string[];
}

export interface QualityUpdate {
  type: "quality.update";
  sharpness: number;
  exposure: number;
  tracking: number;
  novelty: number;
}
