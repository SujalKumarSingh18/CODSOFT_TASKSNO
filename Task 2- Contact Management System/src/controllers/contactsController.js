const Contact = require('../models/contact');

// Create a new contact
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

// Retrieve contacts with search, sorting, and pagination
const getContacts = async (req, res, next) => {
  try {
    const { search, sortBy, order, page, limit } = req.query;

    // 1. Build Query
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

    // 2. Build Sorting
    const sortField = sortBy || 'name';
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOption = { [sortField]: sortOrder };

    // 3. Build Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    // Execute queries
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

// Retrieve a single contact by ID
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

// Update a contact by ID
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

// Delete a contact by ID
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
