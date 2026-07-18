const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
} = require('../controllers/contactsController');
const { validateContact } = require('../middleware/validation');

// GET all contacts (supports search, sort, and pagination)
router.get('/', getContacts);

// GET a single contact by ID
router.get('/:id', getContactById);

// POST a new contact
router.post('/', validateContact, createContact);

// PUT update an existing contact by ID
router.put('/:id', validateContact, updateContact);

// DELETE a contact by ID
router.delete('/:id', deleteContact);

module.exports = router;
