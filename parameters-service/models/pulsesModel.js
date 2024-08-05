const mongoose = require('mongoose');

const pulseSchema = new mongoose.Schema({
  name: { type: String, required: true },              
  unit: { type: String, required: true },              
  description: { type: String, required: true },       
  applications: { type: String, required: true }       
}, { timestamps: true });

const Pulse = mongoose.model('Pulse', pulseSchema);

module.exports = Pulse;
