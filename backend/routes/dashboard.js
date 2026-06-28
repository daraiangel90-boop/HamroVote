// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { getDashboardData, seedParties } = require('../controllers/dashboardController');

router.get('/', getDashboardData);
router.post('/seed', seedParties);

module.exports = router;