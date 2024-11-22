const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  description: String,
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    duration: Number,
    notes: String
  }],
  schedule: [{
    dayOfWeek: Number,
    timeSlot: String
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  targetMuscleGroups: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema); 