/**
 * @file contactsController.js
 * @description Controllers to handle CRUD endpoints for Contacts, including search, sorting, and pagination.
 * @module controllers/contactsController
 */

const Contact = require('../models/contact');

/**
 * Creates and stores a new contact in the database.
 * 
 * @async
 * @function createContact
 * @param {import('express').Request} req - Express request object containing the contact payload in req.body.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback function.
 * @returns {Promise<void>} Sends HTTP response with the created contact document.
 */
const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, address, company } = req.body;
    const contact = new Contact({
      name,
      email,
      phone,
      address,
      company
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a paginated list of contacts with optional search and sorting parameters.
 * Supports partial searches on name, email, and phone number.
 * 
 * @async
 * @function getContacts
 * @param {import('express').Request} req - Express request object containing query params: search, sortBy, order, page, limit.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback function.
 * @returns {Promise<void>} Sends HTTP response with contacts list and pagination metadata.
 */
const getContacts = async (req, res, next) => {
  try {
    const { search, sortBy, order, page, limit } = req.query;

    // 1. Build Query (Filters case-insensitively using regex on Name, Email, or Phone)
    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex }
        ]
      };
    }

    // 2. Build Sorting Options
    const sortField = sortBy || 'name';
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOption = { [sortField]: sortOrder };

    // 3. Build Pagination Math
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    // Execute queries in parallel for efficiency
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort(sortOption)
      .skip(skipNum)
      .limit(limitNum);

    const pages = Math.ceil(total / limitNum);

    res.status(200).json({
      contacts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single contact profile matching the provided ID parameter.
 * 
 * @async
 * @function getContactById
 * @param {import('express').Request} req - Express request object containing the contact ID in req.params.id.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {Promise<void>} Sends HTTP response with the found contact or 404.
 */
const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing contact profile matching the provided ID parameter.
 * 
 * @async
 * @function updateContact
 * @param {import('express').Request} req - Express request object containing contact ID in req.params.id and updates in req.body.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {Promise<void>} Sends HTTP response with the updated contact or 404.
 */
const updateContact = async (req, res, next) => {
  try {
    const { name, email, phone, address, company } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, company },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

/**
 * Removes a contact profile matching the provided ID parameter.
 * 
 * @async
 * @function deleteContact
 * @param {import('express').Request} req - Express request object containing contact ID in req.params.id.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next callback.
 * @returns {Promise<void>} Sends HTTP response confirming deletion.
 */
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
};
