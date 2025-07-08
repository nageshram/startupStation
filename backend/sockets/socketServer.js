import { Server } from 'socket.io'
let io;

const initSocketServer = (server) => {
  io = server;

  io.on("connection", (socket) => {
    //console.log("User connected: " + socket.id);

    socket.on("sendMessage", (data) => { // <--- match frontend
      const { receiver } = data;
      io.to(receiver.toString()).emit("newMessage", data); // <--- match frontend
    });

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("mark-seen", ({ chatId, userId }) => {
      io.to(chatId).emit("message-seen", { chatId, userId });
    });

    socket.on("disconnect", () => {
      //console.log("User disconnected: " + socket.id);
    });
  });
};

export default initSocketServer;