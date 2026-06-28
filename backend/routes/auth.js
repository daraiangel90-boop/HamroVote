// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  saveFaceDescriptor,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/face', protect, saveFaceDescriptor); // ✅ This is the face endpoint

module.exports = router;