import { useCaptureStore } from "../state/captureStore";

export function SessionStatus() {
  const { captureState, acceptedFrames, sessionId } = useCaptureStore();
  const label =
    captureState === "idle"
      ? "Waiting to start"
      : captureState === "completed"
        ? "Capture complete"
        : captureState === "error"
          ? "Capture error"
          : "Session active";

  return (
    <div className="session-badge">
      <span className="status-dot" />
      {label} · {acceptedFrames.length} frames{sessionId ? ` · ${sessionId}` : ""}
    </div>
  );
}
