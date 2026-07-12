const { isValidEmail, isValidDate } = require('../utils/validators');

const validateStudent = (req, res, next) => {
  const { first_name, last_name, email, date_of_birth } = req.body;

  if (!first_name || typeof first_name !== 'string' || first_name.trim() === '') {
    return res.status(400).json({ error: 'Valid first_name is required' });
  }
  if (!last_name || typeof last_name !== 'string' || last_name.trim() === '') {
    return res.status(400).json({ error: 'Valid last_name is required' });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }
  if (!date_of_birth || !isValidDate(date_of_birth)) {
    return res.status(400).json({ error: 'Date of birth must be a valid date in YYYY-MM-DD format' });
  }

  next();
};

const validateCourse = (req, res, next) => {
  const { course_code, title, credits } = req.body;

  if (!course_code || typeof course_code !== 'string' || course_code.trim() === '') {
    return res.status(400).json({ error: 'Valid course_code is required' });
  }
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Valid title is required' });
  }
  const creditsInt = parseInt(credits, 10);
  if (isNaN(creditsInt) || creditsInt <= 0) {
    return res.status(400).json({ error: 'Credits must be a positive integer' });
  }

  next();
};

const validateEnrollment = (req, res, next) => {
  const { student_id, course_id } = req.body;
  const studentIdInt = parseInt(student_id, 10);
  const courseIdInt = parseInt(course_id, 10);

  if (isNaN(studentIdInt) || isNaN(courseIdInt)) {
    return res.status(400).json({ error: 'Valid student_id and course_id are required' });
  }

  next();
};

const validateGrade = (req, res, next) => {
  const { grade } = req.body;

  if (!grade || typeof grade !== 'string' || grade.trim().length > 2) {
    return res.status(400).json({ error: 'Valid grade is required (maximum 2 characters, e.g. A, B+, F)' });
  }

  next();
};

module.exports = {
  validateStudent,
  validateCourse,
  validateEnrollment,
  validateGrade
};
