import { useEffect, useRef } from "react";

import { useCameraStream } from "../hooks/useCameraStream";
import { useCaptureSession } from "../hooks/useCaptureSession";
import { useCaptureStore } from "../state/captureStore";

export function CaptureViewport() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { state, stream } = useCameraStream();
  const { captureState, errorMessage, statusMessage, countdownMs, acceptedFrames } = useCaptureStore();
  const { currentPose, startSession, updateQuality, saveAcceptedFrame, manualRetry } =
    useCaptureSession();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (captureState !== "capturing") {
      return;
    }

    let animationFrame = 0;
    const tick = () => {
      const shouldCapture = updateQuality(videoRef.current);
      if (shouldCapture) {
        void saveAcceptedFrame(videoRef.current);
      }
      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [captureState, saveAcceptedFrame, updateQuality]);

  return (
    <div className="camera-card">
      <div className="camera-feed">
        <video ref={videoRef} className="camera-video" autoPlay muted playsInline />
        <div className="camera-hud">
          <div className="camera-pill">{state === "ready" ? "Camera live" : "Initializing camera"}</div>
          <div className="camera-pill">{acceptedFrames.length} / 6 poses accepted</div>
        </div>
        <div className="camera-overlay">
          <div className="reticle" />
          <div className="camera-copy">
            <strong>{currentPose?.label ?? "Awaiting session start"}</strong>
            <span>{statusMessage}</span>
            {countdownMs > 0 ? <span>Auto-capture in {(countdownMs / 1000).toFixed(1)}s</span> : null}
            {errorMessage ? <span>{errorMessage}</span> : null}
          </div>
        </div>
      </div>
      <div className="camera-actions">
        <button className="action-button primary" onClick={() => void startSession()} disabled={state !== "ready" || captureState === "capturing" || captureState === "completed"}>
          {captureState === "idle" ? "Start Capture" : captureState === "completed" ? "Capture Complete" : "Session Active"}
        </button>
        <button className="action-button" onClick={manualRetry} disabled={captureState !== "capturing"}>
          Retry Current Pose
        </button>
      </div>
    </div>
  );
}
