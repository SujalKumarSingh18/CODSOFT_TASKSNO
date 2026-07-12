const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');
const enrollmentsController = require('../controllers/enrollmentsController');
const { validateStudent } = require('../middleware/validation');

// Define REST API routes for students
router.post('/', validateStudent, studentsController.createStudent);
router.get('/', studentsController.getStudents);
router.get('/:id', studentsController.getStudentById);
router.put('/:id', validateStudent, studentsController.updateStudent);
router.delete('/:id', studentsController.deleteStudent);

// Enrollment sub-route
router.get('/:id/courses', enrollmentsController.getStudentCourses);

module.exports = router;
