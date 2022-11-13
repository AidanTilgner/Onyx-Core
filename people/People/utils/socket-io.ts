import { Server as SocketIOServer } from "socket.io";
import type { Server as httpServer } from "http";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./socket-io.d";

let io: SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
export const initIO = (server: httpServer) => {
  io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.emit(
      "message",
      "Hello there. Socket.io is successfully initilized and connected."
    );
    socket.on("disconnect", () => {
      console.error("A user disconnected");
    });
  });
};

export const emitMessage = (key: string, message: string, ...args: any[]) => {
  return io.emit(key, message, ...args);
};

export const emitArgs = (key: string, ...args: any[]) => {
  return io.emit(key, ...args);
};
