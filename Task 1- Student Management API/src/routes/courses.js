const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const enrollmentsController = require('../controllers/enrollmentsController');
const { validateCourse } = require('../middleware/validation');

// Define REST API routes for courses
router.post('/', validateCourse, coursesController.createCourse);
router.get('/', coursesController.getCourses);
router.get('/:id', coursesController.getCourseById);
router.put('/:id', validateCourse, coursesController.updateCourse);
router.delete('/:id', coursesController.deleteCourse);

// Enrollment sub-route: Get all students enrolled in this course
router.get('/:id/students', enrollmentsController.getCourseStudents);

module.exports = router;
