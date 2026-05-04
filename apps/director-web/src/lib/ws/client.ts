import type { CaptureFrameEnvelope, DirectorServerEvent } from "./protocol";

export class DirectorSocketClient {
  private socket: WebSocket | null = null;

  connect(url: string, onMessage: (event: DirectorServerEvent) => void) {
    this.socket = new WebSocket(url);
    this.socket.onmessage = (message) => {
      onMessage(JSON.parse(message.data) as DirectorServerEvent);
    };
  }

  send(event: CaptureFrameEnvelope) {
    this.socket?.send(JSON.stringify(event));
  }
}
