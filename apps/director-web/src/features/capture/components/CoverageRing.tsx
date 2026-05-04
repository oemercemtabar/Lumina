import { useCaptureStore } from "../state/captureStore";

export function CoverageRing() {
  const { poseSequence, acceptedFrames } = useCaptureStore();
  const accepted = new Set(acceptedFrames.map((frame) => frame.poseId));

  return (
    <section className="card">
      <h2>Coverage Ring</h2>
      <div className="coverage-ring">
        {poseSequence.map((pose, index) => (
          <div
            key={pose.id}
            className={`coverage-segment ${
              accepted.has(pose.id) ? "coverage-complete" : `coverage-${index % 3}`
            }`}
          >
            {pose.label}
          </div>
        ))}
      </div>
    </section>
  );
}
