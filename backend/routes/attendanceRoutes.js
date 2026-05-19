const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getAttendanceOverview, markAttendance, getStudentAttendanceHistory } = require('../controllers/attendanceController');

router.get('/', protect, authorize('admin', 'teacher'), getAttendanceOverview);
router.get('/student/:studentId', protect, authorize('admin', 'teacher'), getStudentAttendanceHistory);
router.post('/mark', protect, authorize('admin', 'teacher'), markAttendance);

module.exports = router;