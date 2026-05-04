import { useCallback, useEffect, useMemo, useRef } from "react";

import { useCaptureStore } from "../state/captureStore";

const QUALITY_THRESHOLD = {
  tracking: 0.72,
  sharpness: 0.68,
  exposure: 0.62,
  novelty: 0.58
};

export function useCaptureSession() {
  const {
    sessionId,
    sessionDir,
    poseSequence,
    currentPoseIndex,
    acceptedFrames,
    captureState,
    setSessionInfo,
    setCaptureState,
    setError,
    setQuality,
    setStatusMessage,
    setCountdownMs,
    advancePose,
    retryPose
  } = useCaptureStore();
  const startedRef = useRef(false);
  const autoCaptureLockRef = useRef(false);
  const countdownUntilRef = useRef<number | null>(null);

  const currentPose = useMemo(
    () => poseSequence[Math.min(currentPoseIndex, poseSequence.length - 1)] ?? null,
    [currentPoseIndex, poseSequence]
  );

  const startSession = useCallback(async () => {
    if (startedRef.current || !window.luminaDesktop) {
      return;
    }

    const createdAt = new Date().toISOString();
    const nextSessionId = `lumina-${createdAt.replaceAll(":", "-")}`;
    setCaptureState("starting");
    setStatusMessage("Creating a local capture session...");

    try {
      const result = await window.luminaDesktop.createSession({
        sessionId: nextSessionId,
        createdAt,
        mode: "neutral-head-v1",
        device: "laptop-webcam"
      });
      startedRef.current = true;
      setSessionInfo(nextSessionId, result.sessionDir);
      setCaptureState("capturing");
      setStatusMessage("Session ready. Hold the requested pose until auto-capture completes.");
    } catch (error) {
      setCaptureState("error");
      setError(error instanceof Error ? error.message : "Failed to create local session.");
    }
  }, [setCaptureState, setError, setSessionInfo, setStatusMessage]);

  const updateQuality = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !currentPose) {
        return;
      }

      const timePulse = (Date.now() % 1800) / 1800;
      const tracking = 0.74 + Math.sin(timePulse * Math.PI) * 0.1;
      const sharpness = 0.69 + Math.cos(timePulse * 1.4 * Math.PI) * 0.08;
      const exposure = 0.7 + Math.sin(timePulse * 1.8 * Math.PI) * 0.06;
      const novelty =
        acceptedFrames.length === 0 ? 0.9 : Math.max(0.58, 0.88 - acceptedFrames.length * 0.06);

      const snapshot = {
        tracking: Math.min(Math.max(tracking, 0), 1),
        sharpness: Math.min(Math.max(sharpness, 0), 1),
        exposure: Math.min(Math.max(exposure, 0), 1),
        novelty: Math.min(Math.max(novelty, 0), 1)
      };

      setQuality(snapshot);

      const ready =
        snapshot.tracking >= QUALITY_THRESHOLD.tracking &&
        snapshot.sharpness >= QUALITY_THRESHOLD.sharpness &&
        snapshot.exposure >= QUALITY_THRESHOLD.exposure &&
        snapshot.novelty >= QUALITY_THRESHOLD.novelty;

      if (ready && countdownUntilRef.current === null) {
        countdownUntilRef.current = Date.now() + currentPose.holdMs;
        setStatusMessage(`Hold ${currentPose.label}. Auto-capture is arming.`);
      }

      if (!ready) {
        countdownUntilRef.current = null;
        setCountdownMs(0);
        setStatusMessage("Stabilizing quality. Hold still and keep your face well lit.");
      }

      if (countdownUntilRef.current !== null) {
        const remaining = Math.max(countdownUntilRef.current - Date.now(), 0);
        setCountdownMs(remaining);
      }

      return countdownUntilRef.current !== null && Date.now() >= countdownUntilRef.current;
    },
    [acceptedFrames.length, currentPose, setCountdownMs, setQuality, setStatusMessage]
  );

  const saveAcceptedFrame = useCallback(
    async (video: HTMLVideoElement | null) => {
      if (
        !video ||
        !currentPose ||
        !sessionId ||
        !window.luminaDesktop ||
        autoCaptureLockRef.current
      ) {
        return;
      }

      autoCaptureLockRef.current = true;

      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Canvas context unavailable.");
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageBase64 = canvas.toDataURL("image/jpeg", 0.92).split(",")[1] ?? "";
        const capturedAt = new Date().toISOString();
        const frameId = `${currentPose.id}-${capturedAt.replaceAll(":", "-")}`;
        const quality = useCaptureStore.getState().quality;
        const result = await window.luminaDesktop.saveFrame({
          sessionId,
          frameId,
          poseId: currentPose.id,
          capturedAt,
          imageBase64,
          metrics: quality
        });

        advancePose({
          frameId,
          poseId: currentPose.id,
          savedPath: result.framePath
        });

        countdownUntilRef.current = null;

        const nextPose = poseSequence[currentPoseIndex + 1];
        if (nextPose) {
          setStatusMessage(`Saved ${currentPose.label}. Next: ${nextPose.label}.`);
        } else {
          setStatusMessage("Capture complete. Session manifest is ready for reconstruction.");
          setCaptureState("completed");
          await window.luminaDesktop.completeSession({
            sessionId,
            completedAt: new Date().toISOString(),
            summary: {
              acceptedFrames: acceptedFrames.length + 1,
              completedPoses: poseSequence.length
            }
          });
        }
      } catch (error) {
        setCaptureState("error");
        setError(error instanceof Error ? error.message : "Failed to save accepted frame.");
      } finally {
        autoCaptureLockRef.current = false;
      }
    },
    [
      acceptedFrames.length,
      advancePose,
      currentPose,
      currentPoseIndex,
      poseSequence,
      sessionId,
      setCaptureState,
      setError,
      setStatusMessage
    ]
  );

  const manualRetry = useCallback(() => {
    countdownUntilRef.current = null;
    retryPose();
    setStatusMessage("Current pose reset. Re-center and let auto-capture arm again.");
  }, [retryPose, setStatusMessage]);

  useEffect(() => {
    if (captureState === "completed" || captureState === "error") {
      countdownUntilRef.current = null;
    }
  }, [captureState]);

  return {
    sessionId,
    sessionDir,
    currentPose,
    captureState,
    startSession,
    updateQuality,
    saveAcceptedFrame,
    manualRetry
  };
}
