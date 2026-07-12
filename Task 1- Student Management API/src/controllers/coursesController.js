const { dbRun, dbGet, dbAll } = require('../utils/dbHelpers');

/**
 * 1. Create a Course
 * POST /api/courses
 */
exports.createCourse = async (req, res, next) => {
  try {
    const { course_code, title, credits, description } = req.body;
    const creditsInt = parseInt(credits, 10);

    const sql = `INSERT INTO courses (course_code, title, credits, description) VALUES (?, ?, ?, ?)`;
    const result = await dbRun(sql, [
      course_code.trim().toUpperCase(),
      title.trim(),
      creditsInt,
      description ? description.trim() : null
    ]);

    res.status(201).json({
      id: result.lastID,
      course_code: course_code.trim().toUpperCase(),
      title: title.trim(),
      credits: creditsInt,
      description: description ? description.trim() : null
    });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed: courses.course_code')) {
      return res.status(400).json({ error: 'Course code already exists' });
    }
    next(err);
  }
};

/**
 * 2. Get Courses (with Search, Filter, Sort, Pagination)
 * GET /api/courses
 */
exports.getCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { search, sortBy = 'id', order = 'ASC' } = req.query;

    let selectSql = 'SELECT * FROM courses';
    let countSql = 'SELECT COUNT(*) as total FROM courses';
    let whereClauses = [];
    let params = [];

    // Filter by search (title or course_code)
    if (search && search.trim() !== '') {
      whereClauses.push('(title LIKE ? OR course_code LIKE ?)');
      const wildCardSearch = `%${search.trim()}%`;
      params.push(wildCardSearch, wildCardSearch);
    }

    if (whereClauses.length > 0) {
      const whereString = ' WHERE ' + whereClauses.join(' AND ');
      selectSql += whereString;
      countSql += whereString;
    }

    // Validate and sanitize sortBy
    const allowedSortColumns = ['id', 'course_code', 'title', 'credits'];
    const sortCol = allowedSortColumns.includes(sortBy) ? sortBy : 'id';
    
    // Validate order
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    selectSql += ` ORDER BY ${sortCol} ${sortOrder}`;

    // Add pagination parameters to data query
    const dataParams = [...params];
    selectSql += ' LIMIT ? OFFSET ?';
    dataParams.push(limit, offset);

    // Run parallel queries
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
 * 3. Get Course by ID
 * GET /api/courses/:id
 */
exports.getCourseById = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const sql = `SELECT * FROM courses WHERE id = ?`;
    const course = await dbGet(sql, [courseId]);

    if (!course) {
      return res.status(404).json({ error: `Course with ID ${courseId} not found` });
    }

    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

/**
 * 4. Update Course
 * PUT /api/courses/:id
 */
exports.updateCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const { course_code, title, credits, description } = req.body;
    const creditsInt = parseInt(credits, 10);

    const sql = `
      UPDATE courses 
      SET course_code = ?, title = ?, credits = ?, description = ? 
      WHERE id = ?
    `;
    const result = await dbRun(sql, [
      course_code.trim().toUpperCase(),
      title.trim(),
      creditsInt,
      description ? description.trim() : null,
      courseId
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ error: `Course with ID ${courseId} not found` });
    }

    res.status(200).json({
      id: parseInt(courseId, 10),
      course_code: course_code.trim().toUpperCase(),
      title: title.trim(),
      credits: creditsInt,
      description: description ? description.trim() : null
    });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed: courses.course_code')) {
      return res.status(400).json({ error: 'Course code already exists' });
    }
    next(err);
  }
};

/**
 * 5. Delete Course
 * DELETE /api/courses/:id
 */
exports.deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const sql = `DELETE FROM courses WHERE id = ?`;
    const result = await dbRun(sql, [courseId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: `Course with ID ${courseId} not found` });
    }

    res.status(200).json({ message: `Course with ID ${courseId} and all its enrollments were deleted successfully` });
  } catch (err) {
    next(err);
  }
};
