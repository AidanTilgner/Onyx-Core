import type { Socket } from "socket.io";

export interface ServerToClientEvents {
  [key: string]: (...args: any[]) => void;
}

export interface ClientToServerEvents {
  [key: string]: (...args: any[]) => void;
}

export interface InterServerEvents {
  [key: string]: (...args: any[]) => void;
}

export interface SocketData {
  name: string;
  age: number;
}
