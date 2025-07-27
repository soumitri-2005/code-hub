import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import ACTIONS from './Action.js';

const app = express();
app.use(cors()); // allow Express routes (if you add any later)

const server = http.createServer(app);

// Apply CORS settings to Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});


// store user socket ids
// This is a simple in-memory store, consider using a database for production
const userSocketMap = {};
// exp
// {
//     'sfsdfsfdsfdsfasasdf': 'username1',
// }

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
