/**
 * @file validation.js
 * @description Custom Express middleware to perform incoming request validation for contact creation/updates,
 * checking data formats, and querying MongoDB to prevent duplicate emails or phone numbers.
 * @module middleware/validation
 */

const { isValidEmail, isValidPhone } = require('../utils/validators');
const Contact = require('../models/contact');

/**
 * Validates the contact request payload (req.body).
 * Checks name, email syntax, phone format, and type compliance of optional fields.
 * Performs asynchronous check against MongoDB to verify no other contact is already using the same email or phone.
 * 
 * @async
 * @function validateContact
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function callback.
 */
const validateContact = async (req, res, next) => {
  const { name, email, phone, address, company } = req.body;
  const isUpdate = req.method === 'PUT';
  const contactId = req.params.id;

  // 1. Basic structural validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Valid name is required' });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  if (!phone || !isValidPhone(phone)) {
    return res.status(400).json({ error: 'A valid phone number is required (7-15 digits, optionally with +, -, or parenthesis)' });
  }

  if (address !== undefined && typeof address !== 'string') {
    return res.status(400).json({ error: 'Address must be a string' });
  }

  if (company !== undefined && typeof company !== 'string') {
    return res.status(400).json({ error: 'Company must be a string' });
  }

  try {
    // 2. Duplicate prevention validation
    
    // Check if email already in use (exclude self if updating)
    const emailQuery = { email: email.toLowerCase() };
    if (isUpdate) {
      emailQuery._id = { $ne: contactId };
    }
    const existingEmail = await Contact.findOne(emailQuery);
    if (existingEmail) {
      return res.status(400).json({ error: `A contact with email '${email}' already exists.` });
    }

    // Check if phone number already in use (exclude self if updating)
    const phoneQuery = { phone };
    if (isUpdate) {
      phoneQuery._id = { $ne: contactId };
    }
    const existingPhone = await Contact.findOne(phoneQuery);
    if (existingPhone) {
      return res.status(400).json({ error: `A contact with phone number '${phone}' already exists.` });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateContact
};
