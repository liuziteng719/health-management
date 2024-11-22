const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['weight', 'bloodPressure', 'heartRate', 'bloodSugar', 'exercise', 'sleep']
  },
  value: {
    type: mongoose.Schema.Mixed,
    required: true
  },
  unit: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  notes: String
});

module.exports = mongoose.model('HealthData', healthDataSchema); 