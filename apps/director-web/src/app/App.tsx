import { CaptureViewport } from "../features/capture/components/CameraViewport";
import { CoverageRing } from "../features/capture/components/CoverageRing";
import { PosePrompt } from "../features/capture/components/PosePrompt";
import { QualityMeters } from "../features/capture/components/QualityMeters";
import { SessionStatus } from "../features/capture/components/SessionStatus";
import { useDesktopRuntime } from "../features/capture/hooks/useDesktopRuntime";
import { useCaptureStore } from "../features/capture/state/captureStore";

export function App() {
  const runtime = useDesktopRuntime();
  const { sessionDir } = useCaptureStore();

  return (
    <main className="layout">
      <section className="hero-panel">
        <div className="panel-header">
          <div className="brand-block">
            <img className="brand-logo" src="/assets/lumina-logo.jpeg" alt="Lumina logo" />
            <div>
              <p className="eyebrow">Lumina</p>
              <h1>Director Desktop</h1>
              <p className="detail">
                {runtime ? `${runtime.platform} ${runtime.arch}` : "Loading desktop runtime..."}
              </p>
            </div>
          </div>
          <SessionStatus />
        </div>
        <div className="stage-grid">
          <CaptureViewport />
          <aside className="side-panel">
            <CoverageRing />
            <PosePrompt />
            <QualityMeters />
            <section className="card">
              <h2>Local Session</h2>
              <p className="detail">
                Accepted frames and the JSON manifest are written to:
              </p>
              <p className="path-chip">{sessionDir ?? "~/Documents/LuminaSessions/<session-id>"}</p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
