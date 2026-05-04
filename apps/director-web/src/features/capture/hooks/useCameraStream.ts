import { useEffect, useState } from "react";

export type CameraState = "idle" | "requesting" | "ready" | "error";

export function useCameraStream() {
  const [state, setState] = useState<CameraState>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function start() {
      setState("requesting");
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          },
          audio: false
        });
        setStream(activeStream);
        setState("ready");
      } catch {
        setState("error");
      }
    }

    void start();

    return () => {
      activeStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return { state, stream };
}
