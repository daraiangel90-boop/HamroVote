// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, nrnId } = req.body;

    if (!name || !email || !password || !nrnId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { nrnId }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, nrnId });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      nrnId: user.nrnId,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      nrnId: user.nrnId,
      isVerified: user.isVerified,
      hasVoted: user.hasVoted,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Save Face
const saveFaceDescriptor = async (req, res) => {
  try {
    const { faceDescriptor } = req.body;

    if (!faceDescriptor || !Array.isArray(faceDescriptor)) {
      return res.status(400).json({ message: 'Valid face descriptor required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.faceDescriptor = faceDescriptor;
    user.isVerified = true;
    await user.save();

    res.json({ success: true, message: 'Face registered', isVerified: true });
  } catch (error) {
    console.error('Save face error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Only update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      nrnId: updatedUser.nrnId,
      isVerified: updatedUser.isVerified,
      hasVoted: updatedUser.hasVoted,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ MAKE SURE ALL ARE EXPORTED
module.exports = {
  registerUser,
  loginUser,
  saveFaceDescriptor,
  getUserProfile,
  updateUserProfile, 
};