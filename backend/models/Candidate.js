// backend/models/Candidate.js
const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  party: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  constituency: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  voteCount: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Index for faster queries
CandidateSchema.index({ constituency: 1, isActive: 1 });

module.exports = mongoose.model('Candidate', CandidateSchema);