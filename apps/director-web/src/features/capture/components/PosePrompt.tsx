import { useCaptureStore } from "../state/captureStore";

export function PosePrompt() {
  const { poseSequence, currentPoseIndex, countdownMs } = useCaptureStore();
  const pose = poseSequence[Math.min(currentPoseIndex, poseSequence.length - 1)];

  return (
    <section className="card">
      <h2>Next Pose</h2>
      <p className="instruction">{pose?.instruction ?? "Capture complete."}</p>
      <p className="detail">{pose?.detail ?? "All required views have been accepted."}</p>
      <p className="detail">
        Hold target: {pose ? `${(pose.holdMs / 1000).toFixed(1)}s` : "done"}
        {countdownMs > 0 ? ` | live countdown ${(countdownMs / 1000).toFixed(1)}s` : ""}
      </p>
    </section>
  );
}
