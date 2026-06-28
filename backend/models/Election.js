// backend/models/Election.js
const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  party: { type: String, required: true },
  symbol: { type: String, default: '🏛️' },
  description: { type: String, default: '' }
});

const ElectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  candidates: [CandidateSchema],
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  contractAddress: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Election', ElectionSchema);