# Architecture Overview

Lumina is split into three operational layers:

1. Director desktop client for local capture and guidance.
2. Optional local orchestration service for manifests and pipeline control.
3. Local reconstruction worker for fast neutral-head fitting and export.

## V1 Target

Lumina v1 is a desktop application for:

- single-person capture
- neutral head reconstruction
- full head output with rough hair coverage
- local execution on Apple Silicon macOS
- GLB-only export
- sub-5-minute turnaround target

## Runtime Topology

### Director Desktop

- Electron host process
- React/Vite renderer
- webcam capture
- MediaPipe landmark tracking
- local pose guidance and frame acceptance UI
- IPC bridge for capture control, file access, and job launch

### Local Orchestration

- session manifest creation
- accepted-frame indexing
- pipeline invocation
- progress aggregation
- artifact registration

### Reconstruction Worker

- keyframe selection
- landmark-guided multi-view fitting
- FLAME neutral head solve
- rough outer-head and hair shell approximation
- texture projection
- GLB export

## Design Constraints

- The renderer is not the source of truth for accepted frames.
- V1 should prefer deterministic local processing over distributed services.
- Full Gaussian optimization is not the primary path for v1 on Apple M3 Pro hardware.
- WebSockets are optional in v1 and should not drive the core architecture.
