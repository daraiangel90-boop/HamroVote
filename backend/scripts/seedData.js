// backend/scripts/seedData.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Party = require('../models/Party');
const Candidate = require('../models/Candidate');
const Ward = require('../models/Ward');

dotenv.config();
connectDB();

const seedParties = async () => {
  const parties = [
    {
      name: 'Nepali Congress',
      shortName: 'NC',
      symbol: '🌲',
      metrics: {
        billsPassed: 12,
        budgetUtilized: 72,
        projectsCompleted: 34,
        promisesFulfilled: 18,
        parliamentAttendance: 85
      },
      projects: [
        { title: 'Koshi Highway Construction', status: 'Completed', budget: 1200000000 },
        { title: 'Digital Nepal Framework', status: 'In Progress', budget: 500000000 }
      ],
      promises: [
        { title: 'Free education up to grade 12', status: 'In Progress' },
        { title: 'Provide 100,000 jobs', status: 'Not Started' }
      ]
    },
    {
      name: 'CPN-UML',
      shortName: 'UML',
      symbol: '☀️',
      metrics: {
        billsPassed: 10,
        budgetUtilized: 65,
        projectsCompleted: 28,
        promisesFulfilled: 15,
        parliamentAttendance: 78
      },
      projects: [
        { title: 'Melamchi Water Supply Project', status: 'Completed', budget: 900000000 }
      ],
      promises: [
        { title: 'Construction of 10,000 km roads', status: 'In Progress' }
      ]
    },
    {
      name: 'CPN-Maoist Centre',
      shortName: 'Maoist',
      symbol: '🔴',
      metrics: {
        billsPassed: 6,
        budgetUtilized: 55,
        projectsCompleted: 20,
        promisesFulfilled: 10,
        parliamentAttendance: 70
      },
      projects: [],
      promises: [
        { title: 'Land reform implementation', status: 'Not Started' }
      ]
    },
    {
      name: 'Rastriya Swatantra Party',
      shortName: 'RSP',
      symbol: '📊',
      metrics: {
        billsPassed: 8,
        budgetUtilized: 60,
        projectsCompleted: 15,
        promisesFulfilled: 12,
        parliamentAttendance: 90
      },
      projects: [],
      promises: []
    }
  ];

  await Party.deleteMany({});
  for (const party of parties) {
    await Party.create(party);
  }
  console.log('✅ Parties seeded!');
};

const seedCandidates = async () => {
  const candidates = [
    {
      name: 'Ram Prasad Sharma',
      party: 'Nepali Congress',
      symbol: '🌲',
      constituency: 'Kathmandu-1',
      district: 'Kathmandu',
      province: 'Bagmati',
      isActive: true,
      description: 'Experienced leader with focus on development'
    },
    {
      name: 'Khadga Prasad Oli',
      party: 'CPN-UML',
      symbol: '☀️',
      constituency: 'Kathmandu-1',
      district: 'Kathmandu',
      province: 'Bagmati',
      isActive: true,
      description: 'Focus on infrastructure and digital transformation'
    },
    {
      name: 'Sher Bahadur Deuba',
      party: 'Nepali Congress',
      symbol: '🌲',
      constituency: 'Kathmandu-1',
      district: 'Kathmandu',
      province: 'Bagmati',
      isActive: true,
      description: 'Advocate for good governance and transparency'
    },
    {
      name: 'Bishnu Paudel',
      party: 'CPN-Maoist',
      symbol: '🔴',
      constituency: 'Kathmandu-1',
      district: 'Kathmandu',
      province: 'Bagmati',
      isActive: true,
      description: 'Commitment to social justice and equality'
    }
  ];

  await Candidate.deleteMany({});
  for (const candidate of candidates) {
    await Candidate.create(candidate);
  }
  console.log('✅ Candidates seeded!');
};

const seedWards = async () => {
  const wards = [
    {
      province: 'Bagmati',
      district: 'Kathmandu',
      municipality: 'Kathmandu Metropolitan City',
      wardNumber: 1,
      constituency: 'Kathmandu-1'
    },
    {
      province: 'Bagmati',
      district: 'Kathmandu',
      municipality: 'Kathmandu Metropolitan City',
      wardNumber: 2,
      constituency: 'Kathmandu-1'
    }
  ];

  await Ward.deleteMany({});
  for (const ward of wards) {
    await Ward.create(ward);
  }
  console.log('✅ Wards seeded!');
};

const run = async () => {
  try {
    await seedParties();
    await seedCandidates();
    await seedWards();
    console.log('✅ All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

run();