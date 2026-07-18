/**
 * @file contact.js
 * @description Mongoose schema and model definition for the Contact entity.
 * @module models/contact
 */

const mongoose = require('mongoose');

/**
 * Mongoose Schema representing a Contact.
 * Enforces field validations, unique constraints on email and phone,
 * and maintains audit timestamps (createdAt, updatedAt).
 */
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
  // Automatically creates 'createdAt' and 'updatedAt' timestamp fields
  timestamps: true
});

// Create a compound text index on name, email, and phone fields to optimize case-insensitive search queries
contactSchema.index({ name: 'text', email: 'text', phone: 'text' });

/**
 * Contact Model compile of contactSchema.
 * Represents the 'contacts' collection in MongoDB.
 */
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
