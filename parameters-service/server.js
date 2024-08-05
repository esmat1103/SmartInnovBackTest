require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const unitRoutes = require('./routes/unitsRoutes');
const pulseRoutes = require('./routes/pulsesRoutes');

const app = express();
const port = process.env.PORT || 3004;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';
console.log('MongoDB URI:', mongoURI);

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);  
  });

app.use(cors());
app.use(express.json());

app.use('/units', unitRoutes);
app.use('/pulses', pulseRoutes);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// WebSocket setup
const wss = new WebSocketServer({ server });
app.locals.wss = wss;

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.send('Welcome to the WebSocket server!');
});

console.log(`WebSocket server is running on port ${port}`);

module.exports = {
  wss
};
