/**
 * Mock socket layer. Mimics socket.io-client surface so swapping in a real
 * client later is a one-file change (replace this module's body).
 */
type Handler = (...args: unknown[]) => void;

class MockSocket {
  private handlers = new Map<string, Set<Handler>>();
  connected = true;

  on(event: string, fn: Handler) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(fn);
    return this;
  }
  off(event: string, fn: Handler) {
    this.handlers.get(event)?.delete(fn);
    return this;
  }
  emit(event: string, ...args: unknown[]) {
    // echo to local listeners to simulate broadcast
    this.handlers.get(event)?.forEach((h) => h(...args));
    return this;
  }
  disconnect() { this.connected = false; this.emit("disconnect"); }
  connect() { this.connected = true; this.emit("connect"); }
}

export const socket = new MockSocket();
