const express = require('express');
const router = express.Router();
const {
  createPulse,
  getAllPulses,
  getPulseById,
  updatePulseById,
  deletePulseById
} = require('../controllers/pulsesController'); 


router.post('/', createPulse); 
router.get('/', getAllPulses);
router.get('/:id', getPulseById);
router.put('/:id', updatePulseById); 
router.delete('/:id', deletePulseById);

module.exports = router;
