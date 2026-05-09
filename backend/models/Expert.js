const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Technology', 'Health', 'Finance', 'Education', 'Lifestyle', 'Business', 'Mental Health', 'Career Coaching', 'Health & Fitness'],
    index: true
  },
  experience: {
    type: Number,
    required: [true, 'Please add experience in years']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  fee: {
    type: Number,
    required: [true, 'Please add consultation fee'],
    default: 500
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  bio: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'
  },
  expertise: [{
    type: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search
expertSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Expert', expertSchema);
