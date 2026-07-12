// Email format regex validation helper
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Date format validation helper (YYYY-MM-DD)
const isValidDate = (dateString) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString) && !isNaN(Date.parse(dateString));
};

module.exports = {
  isValidEmail,
  isValidDate
};
