// backend/models/Voter.js
const mongoose = require('mongoose');

const VoterSchema = new mongoose.Schema({
  voterId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  district: {
    type: String,
    required: true
  },
  municipality: {
    type: String,
    required: true
  },
  ward: {
    type: String,
    required: true
  },
  constituency: {
    type: String,
    required: true
  },
  faceRegistered: {
    type: Boolean,
    default: false
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Voter', VoterSchema);