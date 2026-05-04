export interface TelemetryEvent {
  name: string;
  timestampMs: number;
  attributes?: Record<string, string | number | boolean>;
}

export function createTelemetryEvent(name: string): TelemetryEvent {
  return {
    name,
    timestampMs: Date.now()
  };
}
