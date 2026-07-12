const { dbRun, dbGet, dbAll } = require('../utils/dbHelpers');

/**
 * 1. Enroll a Student in a Course
 * POST /api/enrollments
 */
exports.enrollStudent = async (req, res, next) => {
  try {
    const { student_id, course_id } = req.body;
    const studentIdInt = parseInt(student_id, 10);
    const courseIdInt = parseInt(course_id, 10);

    // Verify student exists
    const student = await dbGet('SELECT id FROM students WHERE id = ?', [studentIdInt]);
    if (!student) {
      return res.status(400).json({ error: `Student with ID ${studentIdInt} does not exist` });
    }

    // Verify course exists
    const course = await dbGet('SELECT id FROM courses WHERE id = ?', [courseIdInt]);
    if (!course) {
      return res.status(400).json({ error: `Course with ID ${courseIdInt} does not exist` });
    }

    // Insert enrollment
    const sql = `INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)`;
    const result = await dbRun(sql, [studentIdInt, courseIdInt]);

    res.status(201).json({
      id: result.lastID,
      student_id: studentIdInt,
      course_id: courseIdInt,
      message: 'Student enrolled in course successfully'
    });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed: enrollments.student_id, enrollments.course_id')) {
      return res.status(400).json({ error: 'Student is already enrolled in this course' });
    }
    next(err);
  }
};

/**
 * 2. Get Enrollments (joins student and course info)
 * GET /api/enrollments
 */
exports.getEnrollments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const countSql = 'SELECT COUNT(*) as total FROM enrollments';
    const selectSql = `
      SELECT 
        e.id as enrollment_id, 
        e.enrollment_date, 
        e.grade,
        s.id as student_id,
        s.first_name, 
        s.last_name, 
        s.email,
        c.id as course_id,
        c.course_code, 
        c.title 
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.id DESC
      LIMIT ? OFFSET ?
    `;

    // Run parallel queries
    const [countResult, rows] = await Promise.all([
      dbGet(countSql),
      dbAll(selectSql, [limit, offset])
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
 * 3. Get Courses a Specific Student is Enrolled in
 * GET /api/students/:id/courses
 */
exports.getStudentCourses = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    // Verify student exists first
    const student = await dbGet('SELECT id FROM students WHERE id = ?', [studentId]);
    if (!student) {
      return res.status(404).json({ error: `Student with ID ${studentId} not found` });
    }

    const sql = `
      SELECT 
        e.id as enrollment_id,
        e.enrollment_date,
        e.grade,
        c.id as course_id,
        c.course_code,
        c.title,
        c.credits
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.student_id = ?
    `;
    const courses = await dbAll(sql, [studentId]);
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};

/**
 * 4. Get Students Enrolled in a Specific Course
 * GET /api/courses/:id/students
 */
exports.getCourseStudents = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    // Verify course exists first
    const course = await dbGet('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (!course) {
      return res.status(404).json({ error: `Course with ID ${courseId} not found` });
    }

    const sql = `
      SELECT 
        e.id as enrollment_id,
        e.enrollment_date,
        e.grade,
        s.id as student_id,
        s.first_name,
        s.last_name,
        s.email
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      WHERE e.course_id = ?
    `;
    const students = await dbAll(sql, [courseId]);
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

/**
 * 5. Update Grade for an Enrollment
 * PUT /api/enrollments/:id
 */
exports.updateGrade = async (req, res, next) => {
  try {
    const enrollmentId = req.params.id;
    const { grade } = req.body;

    const sql = 'UPDATE enrollments SET grade = ? WHERE id = ?';
    const result = await dbRun(sql, [grade.trim().toUpperCase(), enrollmentId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: `Enrollment with ID ${enrollmentId} not found` });
    }

    res.status(200).json({
      id: parseInt(enrollmentId, 10),
      grade: grade.trim().toUpperCase(),
      message: 'Grade updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 6. Delete/Unenroll Student
 * DELETE /api/enrollments/:id
 */
exports.unenrollStudent = async (req, res, next) => {
  try {
    const enrollmentId = req.params.id;

    const sql = 'DELETE FROM enrollments WHERE id = ?';
    const result = await dbRun(sql, [enrollmentId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: `Enrollment with ID ${enrollmentId} not found` });
    }

    res.status(200).json({ message: `Successfully unenrolled (Enrollment ID ${enrollmentId} deleted)` });
  } catch (err) {
    next(err);
  }
};
