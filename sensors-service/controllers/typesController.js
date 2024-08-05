const SensorType = require('../models/typesModel');
const { WebSocketServer } = require('ws');

// Broadcast function
function broadcast(wss, data) {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Create a new sensor type
const createSensorType = async (req, res) => {
  try {
    const sensorType = new SensorType(req.body);
    await sensorType.save();

    // Broadcast to WebSocket clients
    broadcast(req.app.locals.wss, { message: 'Sensor Type created', sensorType });

    res.status(201).json(sensorType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all sensor types
const getAllSensorTypes = async (req, res) => {
  try {
    const sensorTypes = await SensorType.find();
    res.status(200).json(sensorTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a sensor type by ID
const getSensorTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const sensorType = await SensorType.findById(id);
    if (!sensorType) {
      return res.status(404).json({ message: 'Sensor Type not found' });
    }
    res.status(200).json(sensorType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a sensor type by ID
const updateSensorTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedSensorType = await SensorType.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSensorType) {
      return res.status(404).json({ message: 'Sensor Type not found or already updated' });
    }

    // Broadcast to WebSocket clients
    broadcast(req.app.locals.wss, { message: 'Sensor Type updated', sensorType: updatedSensorType });

    res.status(200).json(updatedSensorType);
  } catch (error) {
    console.error('Error updating sensor type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a sensor type by ID
const deleteSensorTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSensorType = await SensorType.findByIdAndDelete(id);
    if (!deletedSensorType) {
      return res.status(404).json({ message: 'Sensor Type not found' });
    }

    // Broadcast to WebSocket clients
    broadcast(req.app.locals.wss, { message: 'Sensor Type deleted', sensorTypeId: id });

    res.status(200).json({ message: 'Sensor Type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSensorType,
  getAllSensorTypes,
  getSensorTypeById,
  updateSensorTypeById,
  deleteSensorTypeById
};
