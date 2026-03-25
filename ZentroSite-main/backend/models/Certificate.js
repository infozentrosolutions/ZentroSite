const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'issued', 'declined'],
    default: 'pending'
  },
  certificateNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  declinedReason: {
    type: String,
    default: null
  },
  issueDate: {
    type: Date,
    default: null
  },
  declineDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certificate', certificateSchema);
