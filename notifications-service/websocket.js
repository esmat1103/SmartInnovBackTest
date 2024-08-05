const socketIo = require('socket.io');
const Notification = require('./models/notificationsModel');
const User = require('./models/User');

let io;

const initWebSocket = (server) => {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('subscribe', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} subscribed to notifications`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  console.log('WebSocket server initialized');
};

const sendNotificationToRole = async (role, message) => {
    try {
      console.log(`Fetching users with role: ${role}`);
      const users = await User.find({ role }).select('_id');
      const userIds = users.map(user => user._id.toString());
      console.log(`Fetched users: ${userIds}`);
  
      for (const userId of userIds) {
        console.log(`Creating notification for user: ${userId}`);
        const notification = new Notification({ userId, type: role, message });
        const savedNotification = await notification.save();
        console.log(`Notification saved for user: ${userId}`, savedNotification);
        io.to(userId).emit('notification', savedNotification);
        console.log(`Notification emitted to user: ${userId}`);
      }
    } catch (error) {
      console.error(`Error sending notifications to ${role}:`, error);
    }
  };
  

module.exports = { initWebSocket, sendNotificationToRole };
