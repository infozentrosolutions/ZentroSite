const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public route for authentication
router.post('/login', login);

// Protected & Authorized Route
// Only an 'admin' can register new users (teachers, students, or other admins)
router.post('/register', protect, authorize('admin'), register);

module.exports = router;
