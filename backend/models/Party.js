// backend/models/Party.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Pending', 'Stalled'],
    default: 'In Progress'
  },
  budget: { type: Number, default: 0 },
  startDate: Date,
  completionDate: Date
}, { _id: true });

const PromiseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ['Fulfilled', 'In Progress', 'Not Started'],
    default: 'Not Started'
  },
  targetDate: Date
}, { _id: true });

const PartySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  shortName: {
    type: String,
    required: true,
    trim: true
  },
  symbol: {
    type: String,
    default: '🏛️'
  },
  metrics: {
    billsPassed: { type: Number, default: 0 },
    budgetUtilized: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    promisesFulfilled: { type: Number, default: 0 },
    parliamentAttendance: { type: Number, default: 0 }
  },
  projects: [ProjectSchema],
  promises: [PromiseSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Party', PartySchema);