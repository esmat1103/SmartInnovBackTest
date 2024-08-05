const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const WebSocket = require('ws');
const devicesRoutes = require('./routes/devicesRoutes');
const countriesRoutes = require('./routes/countriesRoutes');
const statesRoutes = require('./routes/statesRoutes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4002;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartinnov';

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.locals.wss = wss; 

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

app.use('/devices', devicesRoutes);
app.use('/countries', countriesRoutes);
app.use('/states', statesRoutes);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
