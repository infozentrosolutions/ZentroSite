const express = require('express');
const router = express.Router();
const { 
    getCertificateRequests, 
    getStudents, 
    issueCertificate, 
    declineCertificate 
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Teacher routes
router.get('/requests', protect, authorize('teacher'), getCertificateRequests);
router.post('/issue', protect, authorize('teacher'), issueCertificate);
router.put('/decline/:certificateId', protect, authorize('teacher'), declineCertificate);

// Get students list (teacher only)
router.get('/students/list', protect, authorize('teacher'), getStudents);

module.exports = router;
