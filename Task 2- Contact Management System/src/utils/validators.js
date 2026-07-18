// Email format validation helper
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Phone number format validation helper (accepts standard formats, length between 7 and 15 digits/symbols)
const isValidPhone = (phone) => {
  return /^\+?[\d\s\-()]{7,15}$/.test(phone);
};

module.exports = {
  isValidEmail,
  isValidPhone
};
