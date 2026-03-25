const express = require('express');
const router = express.Router();
const {
    createInternship, updateInternship, deleteInternship, getAllInternships,
    getAssignedInternships, addSyllabus, removeSyllabus,
    createBatch, addStudentToBatch, removeStudentFromBatch
} = require('../controllers/internshipController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect); // All internal routes require authentication

// Admin routes
router.get('/', authorize('admin'), getAllInternships);
router.post('/', authorize('admin'), createInternship);
router.put('/:id', authorize('admin'), updateInternship);
router.delete('/:id', authorize('admin'), deleteInternship);

// Teacher routes
router.get('/assigned', authorize('teacher'), getAssignedInternships);
router.post('/:id/syllabus', authorize('teacher'), addSyllabus);
router.delete('/:id/syllabus/:itemIndex', authorize('teacher'), removeSyllabus);

// Teacher batch routes
router.post('/:id/batches', authorize('teacher'), createBatch);
router.post('/:id/batches/:batchId/students', authorize('teacher'), addStudentToBatch);
router.delete('/:id/batches/:batchId/students/:studentId', authorize('teacher'), removeStudentFromBatch);

module.exports = router;
