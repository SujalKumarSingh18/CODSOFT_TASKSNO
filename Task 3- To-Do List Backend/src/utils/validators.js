/**
 * Validation Helper Utilities
 * Provides reusable format and format-pattern matches.
 */

// Email format regex validation helper
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Date format validation helper (supports ISO/UTC and standard date formats)
const isValidDate = (dateString) => {
  if (!dateString) return false;
  const parsed = Date.parse(dateString);
  return !isNaN(parsed);
};

module.exports = {
  isValidEmail,
  isValidDate
};
