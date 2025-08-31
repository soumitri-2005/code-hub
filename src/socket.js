// socket.js
import { io } from "socket.io-client";

let socket = null;

export const initSocket = async () => {
  if (!socket) {
    const URL = import.meta.env.VITE_BACKEND_URL;
    socket = io(URL, {
      "force new connection": true,
      reconnectionAttempts: "Infinity",
      timeout: 10000,
      transports: ["websocket"],
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
