const express = require('express');
const router = express.Router();
const enrollmentsController = require('../controllers/enrollmentsController');
const { validateEnrollment, validateGrade } = require('../middleware/validation');

// Define REST API routes for enrollments
router.post('/', validateEnrollment, enrollmentsController.enrollStudent);
router.get('/', enrollmentsController.getEnrollments);
router.put('/:id', validateGrade, enrollmentsController.updateGrade);
router.delete('/:id', enrollmentsController.unenrollStudent);

module.exports = router;
