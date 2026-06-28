// backend/models/Vote.js
const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  candidateId: {
    type: Number,
    required: true
  },
  txHash: {
    type: String,
    default: ''
  },
  castAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'confirmed'
  }
}, { timestamps: true });

// Ensure one voter per election
VoteSchema.index({ voterId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);