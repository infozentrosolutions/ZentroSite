const express = require('express');
const router = express.Router();
const { getUsersByRole, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Admin and teachers can list users by role (teachers typically request students)
router.get('/', protect, authorize('admin','teacher'), getUsersByRole);

// Only admin can delete a user
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
