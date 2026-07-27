declare module 'roslib' {
  export class Ros {
    constructor(options: { url: string });
    isConnected: boolean;
    on(event: 'connection' | 'error' | 'close', callback: (error?: unknown) => void): void;
    close(): void;
  }

  export class Topic {
    constructor(options: { ros: Ros; name: string; messageType: string });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscribe(callback: (message: any) => void): void;
    publish(message: Message): void;
  }

  export class Message {
    constructor(values: Record<string, unknown>);
  }
}

declare module '*.css';
