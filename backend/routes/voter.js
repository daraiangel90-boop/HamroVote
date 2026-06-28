// backend/routes/voter.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate');
const User = require('../models/User');

// Register Voter ID
router.post('/register', protect, async (req, res) => {
  try {
    const { voterId, age, district, municipality, ward, constituency } = req.body;

    // Check if voter ID already exists
    const existingVoter = await Voter.findOne({ voterId });
    if (existingVoter) {
      return res.status(400).json({ message: 'Voter ID already registered' });
    }

    // Get user details
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create voter record
    const voter = await Voter.create({
      voterId,
      userId: req.user.id,
      name: user.name,
      age,
      district,
      municipality,
      ward,
      constituency
    });

    res.status(201).json({
      success: true,
      message: 'Voter ID registered successfully',
      data: voter
    });
  } catch (error) {
    console.error('Voter registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get voter's ballot (candidates by constituency)
router.get('/ballot/:voterId', protect, async (req, res) => {
  try {
    const { voterId } = req.params;
    
    // Find voter
    const voter = await Voter.findOne({ voterId });
    if (!voter) {
      return res.status(404).json({ message: 'Voter ID not found' });
    }

    // Check if this voter belongs to the user
    if (voter.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if already voted
    if (voter.hasVoted) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    // ✅ Get candidates from voter's constituency
    const candidates = await Candidate.find({
      constituency: voter.constituency,
      isActive: true
    });

    res.json({
      success: true,
      data: {
        voter: {
          name: voter.name,
          district: voter.district,
          constituency: voter.constituency,
          ward: voter.ward
        },
        candidates: candidates.length > 0 ? candidates : []
      }
    });
  } catch (error) {
    console.error('Get ballot error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get voter by ID
router.get('/:voterId', protect, async (req, res) => {
  try {
    const voter = await Voter.findOne({ voterId: req.params.voterId });
    if (!voter) {
      return res.status(404).json({ message: 'Voter ID not found' });
    }

    if (voter.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, data: voter });
  } catch (error) {
    console.error('Get voter error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;