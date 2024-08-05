const Pulse = require('../models/pulsesModel');

function broadcast(wss, data) {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Create a new pulse
const createPulse = async (req, res) => {
  try {
    const pulse = new Pulse(req.body);
    await pulse.save();

    broadcast(req.app.locals.wss, { message: 'Pulse created', pulse });

    res.status(201).json(pulse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all pulses
const getAllPulses = async (req, res) => {
  try {
    const pulses = await Pulse.find();
    res.status(200).json(pulses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a pulse by ID
const getPulseById = async (req, res) => {
  const { id } = req.params;
  try {
    const pulse = await Pulse.findById(id);
    if (!pulse) {
      return res.status(404).json({ message: 'Pulse not found' });
    }
    res.status(200).json(pulse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a pulse by ID
const updatePulseById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPulse = await Pulse.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPulse) {
      return res.status(404).json({ message: 'Pulse not found or already updated' });
    }

    broadcast(req.app.locals.wss, { message: 'Pulse updated', pulse: updatedPulse });

    res.status(200).json(updatedPulse);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a pulse by ID
const deletePulseById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPulse = await Pulse.findByIdAndDelete(id);
    if (!deletedPulse) {
      return res.status(404).json({ message: 'Pulse not found' });
    }

    broadcast(req.app.locals.wss, { message: 'Pulse deleted', pulseId: id });

    res.status(200).json({ message: 'Pulse deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPulse,
  getAllPulses,
  getPulseById,
  updatePulseById,
  deletePulseById
};
