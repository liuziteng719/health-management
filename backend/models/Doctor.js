const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: String,
  qualification: [String],
  experience: Number,
  availability: [{
    dayOfWeek: Number,
    timeSlots: [{
      start: String,
      end: String
    }]
  }],
  consultationFee: Number,
  rating: {
    average: Number,
    count: Number
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: Date
  }]
});

module.exports = mongoose.model('Doctor', doctorSchema); 