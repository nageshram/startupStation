const { Server } = require("socket.io");
let io;

const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on("send-message", (data) => {
      const { chatId, sender, receiver, text } = data;
      io.to(receiver.toString()).emit("receive-message", data);
    });

    socket.on("join", (userId) => {
      socket.join(userId.toString());
    });

    socket.on("mark-seen", ({ chatId, userId }) => {
      io.to(chatId).emit("message-seen", { chatId, userId });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });
  });
};

module.exports = initSocketServer;