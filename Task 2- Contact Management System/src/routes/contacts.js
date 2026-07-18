/**
 * @file contacts.js
 * @description REST API Routes mapping endpoint URIs to the contacts controller functions,
 * applying validation middleware where necessary.
 * @module routes/contacts
 */

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

/**
 * Route retrieving all contacts.
 * Supports query pagination, sorting, and keyword searching.
 * @name get/contacts
 * @path {GET} /api/contacts
 */
router.get('/', getContacts);

/**
 * Route retrieving a single contact profile by ID.
 * @name get/contacts/:id
 * @path {GET} /api/contacts/:id
 */
router.get('/:id', getContactById);

/**
 * Route creating a new contact profile.
 * Applies validateContact middleware before execution.
 * @name post/contacts
 * @path {POST} /api/contacts
 */
router.post('/', validateContact, createContact);

/**
 * Route updating an existing contact profile by ID.
 * Applies validateContact middleware before execution.
 * @name put/contacts/:id
 * @path {PUT} /api/contacts/:id
 */
router.put('/:id', validateContact, updateContact);

/**
 * Route deleting an existing contact profile by ID.
 * @name delete/contacts/:id
 * @path {DELETE} /api/contacts/:id
 */
router.delete('/:id', deleteContact);

module.exports = router;
