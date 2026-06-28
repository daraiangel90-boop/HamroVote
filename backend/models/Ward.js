// backend/models/Ward.js
const mongoose = require('mongoose');

const WardSchema = new mongoose.Schema({
  province: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  municipality: {
    type: String,
    required: true
  },
  wardNumber: {
    type: Number,
    required: true
  },
  constituency: {
    type: String,
    required: true
  },
  voterCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Index for faster queries
WardSchema.index({ district: 1, municipality: 1, wardNumber: 1 });

module.exports = mongoose.model('Ward', WardSchema);