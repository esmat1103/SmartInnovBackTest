const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { WebSocketServer } = require('ws');
const sensorsRoutes = require('./routes/sensorsRoutes');
const sensorTypesRoutes = require('./routes/typesRoutes'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartinnov';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

app.use(cors());
app.use(express.json());
app.use('/sensors',sensorsRoutes);
app.use('/sensorTypes',sensorTypesRoutes); 

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const wss = new WebSocketServer({ server });
app.locals.wss = wss;

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server is running on port ${port}`);
