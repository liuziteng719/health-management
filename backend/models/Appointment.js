const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  dateTime: Date,
  type: {
    type: String,
    enum: ['online', 'offline']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  symptoms: String,
  medicalHistory: String,
  prescription: {
    medicines: [{
      name: String,
      dosage: String,
      duration: String,
      notes: String
    }],
    advice: String,
    followUpDate: Date
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema); 