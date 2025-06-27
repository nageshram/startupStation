let io;
const initNotificationSocket = (_io) => {
  io = _io;

  io.on('connection', (socket) => {
    socket.on('join-user', (userId) => {
      socket.join(userId);
    });
  });
};

const sendNotification = (userId, notification) => {
  io.to(userId.toString()).emit('new-notification', notification);
};

export { initNotificationSocket, sendNotification };