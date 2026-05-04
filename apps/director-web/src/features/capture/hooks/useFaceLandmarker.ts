export interface FaceTrackingSnapshot {
  yaw: number;
  pitch: number;
  roll: number;
  confidence: number;
}

export function useFaceLandmarker(): FaceTrackingSnapshot | null {
  return null;
}
