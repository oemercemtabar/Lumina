# Transport Strategy

WebSockets are no longer the primary v1 transport.

Lumina v1 uses:

- Electron IPC between desktop host and renderer
- direct local process invocation for reconstruction jobs
- optional loopback HTTP/WebSocket control paths for debugging or future service separation

## When WebSockets Still Matter

Keep the WebSocket contracts for:

- optional local orchestration service
- future remote job execution
- multi-process debugging tools

Primary session channel: `/ws/capture`

Client events:

- `session.init`
- `frame.meta`
- `frame.chunk`
- `capture.commit`
- `session.finish`

Server events:

- `directive.next_pose`
- `quality.update`
- `coverage.update`
- `capture.accepted`
- `capture.rejected`
- `job.progress`
- `artifact.ready`

## V1 Recommendation

Treat these messages as protocol shapes, not as the required transport in the shipping desktop app.
