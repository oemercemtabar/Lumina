<p align="center">
  <img src="apps/director-web/public/assets/lumina-logo.jpeg" alt="Lumina logo" width="220" />
</p>

# Lumina

Lumina is a desktop-first active-capture system for fast 3D head reconstruction.  
V1 is focused on a practical local workflow: capture a single neutral head from a laptop webcam, fit a coarse full-head model with rough hair coverage, and export a `GLB` on macOS.

## V1 Goal

- Single-person only
- Neutral head only
- Laptop webcam only
- Full head with rough hair
- GLB export only
- Local reconstruction on macOS
- Target turnaround under 5 minutes

## Current Architecture

- `apps/director-desktop`
  Electron shell for local capture, session control, and desktop runtime integration
- `apps/director-web`
  React + Vite + Three.js renderer embedded inside Electron
- `services/recon-api`
  Optional local orchestration service for manifests, pipeline control, and future decoupling
- `services/recon-worker`
  Local reconstruction worker for FLAME fitting and GLB export
- `packages/protocol`
  Shared TypeScript protocol and event contracts

## Product Direction

Lumina v1 is intentionally not chasing maximum fidelity.
The current target is a robust and fast local capture loop that:

- guides the user through a fixed neutral pose sequence
- auto-accepts stable frames
- stores a local JSON session manifest
- prepares a local reconstruction handoff

The long-term direction can still include higher-end Gaussian Splatting pipelines, but that is not the default production path for the first macOS release.

## Local Development

Requirements:

- Node.js 20+
- `pnpm`
- Python 3.11+
- `uv`
- macOS with webcam access

Install and run:

```bash
corepack enable
corepack prepare pnpm@10.2.0 --activate
pnpm install
uv sync
pnpm dev
```

## Important pnpm Note

On some machines, `pnpm` blocks install/build scripts by default.  
If Electron fails with `Electron failed to install correctly`, approve build scripts and rebuild:

```bash
pnpm approve-builds
pnpm rebuild
pnpm --filter director-desktop exec electron --version
pnpm dev
```

Approve at least:

- `electron`
- `esbuild`

## Repository Notes

- Logo asset: `apps/director-web/public/assets/lumina-logo.jpeg`
- Local capture sessions are written under `~/Documents/LuminaSessions`
- The desktop app currently includes:
  - webcam preview
  - pose sequence state
  - automatic frame acceptance scaffold
  - manual retry
  - local manifest writes through Electron IPC

## Status

This repository currently contains the desktop-first scaffold, capture-loop foundation, local IPC bridge, and reconstruction boundaries for Lumina v1.
