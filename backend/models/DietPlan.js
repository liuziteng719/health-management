const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  description: String,
  meals: [{
    type: String,
    time: String,
    foods: [{
      name: String,
      portion: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    }]
  }],
  totalCalories: Number,
  dietaryRestrictions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DietPlan', dietPlanSchema); 