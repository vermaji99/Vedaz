const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  userEmail: {
    type: String,
    required: [true, 'Please add your email'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    index: true
  },
  userPhone: {
    type: String,
    required: [true, 'Please add your phone number'],
    trim: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: [true, 'Please add a booking date'],
    index: true
  },
  timeSlot: {
    type: String, // Format: HH:mm
    required: [true, 'Please add a time slot']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Confirmed',
    index: true
  }
}, {
  timestamps: true
});

// Index to prevent double booking: Same expert, same date, same timeSlot
bookingSchema.index({ expert: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
