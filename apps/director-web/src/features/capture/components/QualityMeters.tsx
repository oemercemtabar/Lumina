import { useCaptureStore } from "../state/captureStore";

export function QualityMeters() {
  const { quality } = useCaptureStore();
  const meters = [
    ["Tracking", quality.tracking],
    ["Sharpness", quality.sharpness],
    ["Exposure", quality.exposure],
    ["Novelty", quality.novelty]
  ] as const;

  return (
    <section className="card">
      <h2>Pose Quality</h2>
      {meters.map(([label, value]) => (
        <div key={label} className="meter">
          <span>{label}</span>
          <progress max={1} value={value} />
          <span className="meter-value">{Math.round(value * 100)}%</span>
        </div>
      ))}
    </section>
  );
}
