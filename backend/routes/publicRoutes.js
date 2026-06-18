const express = require('express');
const router = express.Router();
const { getPublicStudentById } = require('../controllers/userController');

router.get('/students/:id', getPublicStudentById);

module.exports = router;