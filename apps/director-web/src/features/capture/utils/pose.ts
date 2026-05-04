export interface EulerPose {
  yaw: number;
  pitch: number;
  roll: number;
}

export function quantizePose(pose: EulerPose) {
  const yawBucket = Math.round(pose.yaw / 15) * 15;
  const pitchBucket = Math.round(pose.pitch / 15) * 15;
  return `${yawBucket}:${pitchBucket}`;
}
