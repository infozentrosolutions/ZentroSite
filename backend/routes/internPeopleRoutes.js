const express = require('express');
const router = express.Router();
const {
    getInternPeople,
    getPublicInternPersonById,
    createInternPerson,
    bulkUpsertInternPeople,
    updateInternPerson,
    deleteInternPerson
} = require('../controllers/internPeopleController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', getInternPeople);
router.get('/public/:id', getPublicInternPersonById);
router.post('/', protect, authorize('admin'), createInternPerson);
router.post('/bulk', protect, authorize('admin'), bulkUpsertInternPeople);
router.put('/:id', protect, authorize('admin'), updateInternPerson);
router.delete('/:id', protect, authorize('admin'), deleteInternPerson);

module.exports = router;