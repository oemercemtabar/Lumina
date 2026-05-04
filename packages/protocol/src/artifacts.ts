export interface ArtifactReady {
  type: "artifact.ready";
  sessionId: string;
  artifactId: string;
  artifactKind: "glb" | "obj" | "flame" | "gaussians" | "report";
  url: string;
}
