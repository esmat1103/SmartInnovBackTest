// server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { initWebSocket } = require('./websocket');
const notificationRoutes = require('./routes/notificationsRoutes');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use('/api', notificationRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

initWebSocket(server);

const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
