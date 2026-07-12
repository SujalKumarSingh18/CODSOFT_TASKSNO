const db = require('../config/database');

/**
 * 1. Create a Student
 * POST /api/students
 */
exports.createStudent = (req, res, next) => {
  const { first_name, last_name, email, date_of_birth } = req.body;

  // TODO: Validate input fields. 
  // Ensure first_name, last_name, email, and date_of_birth are present and not empty.
  // Validate that email is in a proper format.
  // Hint: If invalid, return an HTTP 400 (Bad Request) status with a helpful message.

  // TODO: Insert the student into the database.
  // SQL Query Hint: INSERT INTO students (first_name, last_name, email, date_of_birth) VALUES (?, ?, ?, ?)
  // SQLite Hint: Use db.run(sql, [params], function(err) { ... })
  // In db.run, "this.lastID" inside the callback contains the auto-incremented ID of the inserted record.
  // If a unique constraint fails (e.g. duplicate email), return HTTP 400 or HTTP 409 (Conflict).
};

/**
 * 2. Get Students (with Search, Filter, Sort, Pagination)
 * GET /api/students
 */
exports.getStudents = (req, res, next) => {
  // Query parameters:
  // - page (default 1)
  // - limit (default 10)
  // - search (optional, searches first_name or last_name)
  // - email (optional, filters by exact email match)
  // - sortBy (optional, defaults to 'id')
  // - order (optional, 'ASC' or 'DESC', defaults to 'ASC')
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { search, email, sortBy = 'id', order = 'ASC' } = req.query;

  // TODO: Safely construct your SQL query.
  // 1. Initialize query parts: SELECT * FROM students
  // 2. Build WHERE clauses:
  //    - If "search" is provided, check: (first_name LIKE ? OR last_name LIKE ?) -> use "%" + search + "%" as parameters.
  //    - If "email" is provided, check: email = ?
  // 3. Prevent SQL injection on sorting! Validate that `sortBy` is one of the allowed columns: ['id', 'first_name', 'last_name', 'email', 'date_of_birth', 'created_at']
  //    Validate that `order` is either 'ASC' or 'DESC'.
  // 4. Append ORDER BY, LIMIT, and OFFSET.
  // 
  // SQLite Hint:
  // Use db.all(sql, params, (err, rows) => { ... }) to retrieve the list of students.
  // Keep in mind, you should also calculate total records to provide pagination metadata (total, page, limit, pages)!
  // You can run a second query: SELECT COUNT(*) as total FROM students WHERE ... (matching the same filters).
};

/**
 * 3. Get Student by ID
 * GET /api/students/:id
 */
exports.getStudentById = (req, res, next) => {
  const studentId = req.params.id;

  // TODO: Retrieve a student by ID.
  // SQL Query Hint: SELECT * FROM students WHERE id = ?
  // SQLite Hint: Use db.get(sql, [params], (err, row) => { ... })
  // If the student doesn't exist, return HTTP 404 (Not Found).
};

/**
 * 4. Update Student
 * PUT /api/students/:id
 */
exports.updateStudent = (req, res, next) => {
  const studentId = req.params.id;
  const { first_name, last_name, email, date_of_birth } = req.body;

  // TODO: Validate update fields (similar to create validations).
  
  // TODO: Update student details in the database.
  // SQL Query Hint: UPDATE students SET first_name = ?, last_name = ?, email = ?, date_of_birth = ? WHERE id = ?
  // SQLite Hint: Use db.run(sql, [params], function(err) { ... })
  // Inside the callback, check "this.changes". If it is 0, it means no record was updated (student ID didn't exist). Return HTTP 404.
};

/**
 * 5. Delete Student
 * DELETE /api/students/:id
 */
exports.deleteStudent = (req, res, next) => {
  const studentId = req.params.id;

  // TODO: Delete the student from the database.
  // SQL Query Hint: DELETE FROM students WHERE id = ?
  // SQLite Hint: Use db.run(sql, [params], function(err) { ... })
  // Inside the callback, check "this.changes". If it is 0, it means no record was deleted. Return HTTP 404.
};
