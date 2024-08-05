const Sensor = require('../models/sensorsModel');
const { WebSocketServer } = require('ws');

// Broadcast function
function broadcast(wss, data) {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Create a new sensor
const createSensor = async (req, res) => {
  try {
    const sensor = new Sensor(req.body);
    await sensor.save();

    // Broadcast to WebSocket clients
    broadcast(req.app.locals.wss, { message: 'Sensor created', sensor });

    res.status(201).json(sensor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all sensors
const getAllSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find();
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a sensor by ID
const getSensorById = async (req, res) => {
  const { id } = req.params;
  try {
    const sensor = await Sensor.findById(id);
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a sensor by ID
const updateSensorById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedSensor = await Sensor.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSensor) {
      return res.status(404).json({ message: 'Sensor not found or already updated' });
    }

    broadcast(req.app.locals.wss, { message: 'Sensor updated', sensor: updatedSensor });

    res.status(200).json(updatedSensor);
  } catch (error) {
    console.error('Error updating sensor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a sensor by ID
const deleteSensorById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSensor = await Sensor.findByIdAndDelete(id);
    if (!deletedSensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    broadcast(req.app.locals.wss, { message: 'Sensor deleted', sensorId: id });

    res.status(200).json({ message: 'Sensor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSensorsByDevice = async (req, res) => {
  try {
      const { deviceId } = req.query; // Get deviceId from query parameters
      if (!deviceId) {
          return res.status(400).json({ message: 'Device ID is required' });
      }

      // Validate if deviceId is a valid string
      if (typeof deviceId !== 'string') {
          return res.status(400).json({ message: 'Invalid Device ID format' });
      }

      // Fetch sensors associated with the given deviceId
      const sensors = await Sensor.find({ deviceID: deviceId });
      res.json(sensors);
  } catch (error) {
      console.error('Error fetching sensors by device:', error);
      res.status(500).json({ message: 'Failed to fetch sensors' });
  }
};

module.exports = {
  createSensor,
  getAllSensors,
  getSensorById,
  updateSensorById,
  deleteSensorById,
  getSensorsByDevice,

};
