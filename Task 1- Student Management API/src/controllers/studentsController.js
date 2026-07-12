const { dbRun, dbGet, dbAll } = require('../utils/dbHelpers');

/**
 * 1. Create a Student
 * POST /api/students
 */
exports.createStudent = async (req, res, next) => {
  try {
    const { first_name, last_name, email, date_of_birth } = req.body;

    const sql = `INSERT INTO students (first_name, last_name, email, date_of_birth) VALUES (?, ?, ?, ?)`;
    const result = await dbRun(sql, [first_name.trim(), last_name.trim(), email.trim().toLowerCase(), date_of_birth]);

    res.status(201).json({
      id: result.lastID,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      date_of_birth
    });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed: students.email')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    next(err);
  }
};

/**
 * 2. Get Students (with Search, Filter, Sort, Pagination)
 * GET /api/students
 */
exports.getStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { search, email, sortBy = 'id', order = 'ASC' } = req.query;

    // Base query components
    let selectSql = 'SELECT * FROM students';
    let countSql = 'SELECT COUNT(*) as total FROM students';
    let whereClauses = [];
    let params = [];

    // Filter by search (first_name or last_name)
    if (search && search.trim() !== '') {
      whereClauses.push('(first_name LIKE ? OR last_name LIKE ?)');
      const wildCardSearch = `%${search.trim()}%`;
      params.push(wildCardSearch, wildCardSearch);
    }

    // Filter by exact email match
    if (email && email.trim() !== '') {
      whereClauses.push('email = ?');
      params.push(email.trim().toLowerCase());
    }

    // Append WHERE clauses if any filters exist
    if (whereClauses.length > 0) {
      const whereString = ' WHERE ' + whereClauses.join(' AND ');
      selectSql += whereString;
      countSql += whereString;
    }

    // Validate and sanitize sortBy to prevent SQL Injection
    const allowedSortColumns = ['id', 'first_name', 'last_name', 'email', 'date_of_birth', 'created_at'];
    const sortCol = allowedSortColumns.includes(sortBy) ? sortBy : 'id';
    
    // Validate order
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    selectSql += ` ORDER BY ${sortCol} ${sortOrder}`;

    // Add pagination parameters to data query
    const dataParams = [...params];
    selectSql += ' LIMIT ? OFFSET ?';
    dataParams.push(limit, offset);

    // Run count and data queries in parallel
    const [countResult, rows] = await Promise.all([
      dbGet(countSql, params),
      dbAll(selectSql, dataParams)
    ]);

    const totalRecords = countResult ? countResult.total : 0;
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      data: rows,
      pagination: {
        page,
        limit,
        totalPages,
        totalRecords
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 3. Get Student by ID
 * GET /api/students/:id
 */
exports.getStudentById = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const sql = `SELECT * FROM students WHERE id = ?`;
    const student = await dbGet(sql, [studentId]);

    if (!student) {
      return res.status(404).json({ error: `Student with ID ${studentId} not found` });
    }

    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

/**
 * 4. Update Student
 * PUT /api/students/:id
 */
exports.updateStudent = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const { first_name, last_name, email, date_of_birth } = req.body;

    const sql = `
      UPDATE students 
      SET first_name = ?, last_name = ?, email = ?, date_of_birth = ? 
      WHERE id = ?
    `;
    const result = await dbRun(sql, [
      first_name.trim(),
      last_name.trim(),
      email.trim().toLowerCase(),
      date_of_birth,
      studentId
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ error: `Student with ID ${studentId} not found` });
    }

    res.status(200).json({
      id: parseInt(studentId, 10),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      date_of_birth
    });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed: students.email')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    next(err);
  }
};

/**
 * 5. Delete Student
 * DELETE /api/students/:id
 */
exports.deleteStudent = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    // Delete query
    const sql = `DELETE FROM students WHERE id = ?`;
    const result = await dbRun(sql, [studentId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: `Student with ID ${studentId} not found` });
    }

    res.status(200).json({ message: `Student with ID ${studentId} and all their enrollments were deleted successfully` });
  } catch (err) {
    next(err);
  }
};
