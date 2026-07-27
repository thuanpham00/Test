/// <reference types="vite/client" />

interface ROSLIBNamespace {
  Ros: new (options: { url: string }) => ROSInstance;
  Topic: new (options: { ros: ROSInstance; name: string; messageType: string }) => ROSTopic;
  Message: new (values: Record<string, unknown>) => ROSMessage;
}

interface ROSInstance {
  isConnected: boolean;
  on(event: 'connection' | 'error' | 'close', callback: (error?: unknown) => void): void;
  close(): void;
}

interface ROSTopic {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(callback: (message: any) => void): void;
  publish(message: ROSMessage): void;
}

interface ROSMessage {
  [key: string]: unknown;
}

declare interface Window {
  ROSLIB: ROSLIBNamespace;
}

declare module '*.css';
