const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['exercise', 'meditation', 'medication']
  },
  title: String,
  description: String,
  duration: Number,
  scheduledTime: Date,
  completed: {
    type: Boolean,
    default: false
  },
  reminder: {
    enabled: Boolean,
    time: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema); 