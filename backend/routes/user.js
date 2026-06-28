// backend/routes/user.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Simple test route
router.get('/test', protect, (req, res) => {
  res.json({ message: 'User route works', user: req.user });
});

module.exports = router;