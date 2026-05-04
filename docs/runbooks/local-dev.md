# Local Development

1. Copy `.env.example` to `.env`.
2. Run `pnpm install`.
3. Run `uv sync`.
4. Run `make dev` to start the Electron host and renderer.
5. Run `make api` only if you want the optional local orchestration service.
6. Run `make worker` only when testing the reconstruction pipeline directly.

## Notes

- V1 is desktop-first on macOS, not browser-first.
- Docker dependencies are optional for now.
- The core transport path for the UI is Electron IPC, not remote networking.
