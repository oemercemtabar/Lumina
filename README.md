# Lumina

Lumina is a desktop-first active-capture system for riggable 3D head reconstruction.

It combines:

- `apps/director-desktop`: Electron shell for local capture, session control, and export UX
- `apps/director-web`: React, Vite, and Three.js renderer used inside the desktop shell
- `services/recon-api`: optional local orchestration service for sessions, manifests, and pipeline control
- `services/recon-worker`: local reconstruction worker for FLAME fitting and GLB export
- `packages/protocol`: shared TypeScript protocol contracts

## Brand Assets

- Logo asset: `apps/director-web/public/assets/lumina-logo.jpeg`

## Workspace

- Frontend package manager: `pnpm`
- Python package manager: `uv`
- Primary runtime target: macOS desktop app
- Primary transport in v1: Electron IPC with optional local loopback API
- Reconstruction target in v1: neutral full-head GLB with rough hair coverage
- Hardware target: Apple Silicon MacBook Pro, local execution

## Getting Started

```bash
make bootstrap
make dev
```

## Status

This repository currently contains the desktop-first scaffold, local pipeline boundaries, and interface contracts for Lumina v1.

## V1 Scope

- Single-person only
- Neutral head only
- Laptop webcam only
- Full head with rough hair
- GLB export only
- Local reconstruction on macOS
- Target turnaround under 5 minutes
