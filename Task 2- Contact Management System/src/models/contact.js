const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  company: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Create text index for search functionality on name, email, and phone
contactSchema.index({ name: 'text', email: 'text', phone: 'text' });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
