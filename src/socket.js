// socket.js
import { io } from "socket.io-client";

let socket = null;

export const initSocket = async () => {
  if (!socket) {
    const URL = import.meta.env.VITE_BACKEND_URL;
    if (!URL) {
      console.error("❌ VITE_BACKEND_URL is not defined");
      return null;
    }

    socket = io(URL, {
      forceNew: true,
      reconnectionAttempts: Infinity, // Keep trying to reconnect
      timeout: 10000,
      transports: ["websocket"],
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
