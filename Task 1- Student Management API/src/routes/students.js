const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');

// Define REST API routes for students
router.post('/', studentsController.createStudent);
router.get('/', studentsController.getStudents);
router.get('/:id', studentsController.getStudentById);
router.put('/:id', studentsController.updateStudent);
router.delete('/:id', studentsController.deleteStudent);

module.exports = router;
