// backend/models/GovernmentData.js
const mongoose = require('mongoose');

const GovernmentDataSchema = new mongoose.Schema(
  {
    data: {
      agreements: [
        {
          title: String,
          status: String,
          ministry: String,
          progress: String,
        },
      ],
      bills: [
        {
          name: String,
          status: String,
          ministry: String,
          introducedDate: String,
        },
      ],
      budgetData: {
        frozenAmount: String,
        totalBudget: String,
        utilized: String,
      },
      source: String,
      scrapedAt: String,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GovernmentData', GovernmentDataSchema);