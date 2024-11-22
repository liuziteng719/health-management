const mongoose = require('mongoose');

const mentalHealthSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentDate: {
    type: Date,
    default: Date.now
  },
  moodScore: Number,
  stressLevel: Number,
  sleepQuality: Number,
  anxietySymptoms: [String],
  depressionSymptoms: [String],
  notes: String,
  recommendations: [{
    type: String,
    description: String,
    resources: [String]
  }]
});

module.exports = mongoose.model('MentalHealth', mentalHealthSchema); 