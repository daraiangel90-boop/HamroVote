// backend/controllers/dashboardController.js
const Party = require('../models/Party');

// @desc    Get dashboard data
// @route   GET /api/dashboard
const getDashboardData = async (req, res) => {
  try {
    const parties = await Party.find({});
    
    if (parties.length === 0) {
      // Return empty array if no parties
      return res.json({
        success: true,
        data: {
          partyPerformance: [],
          projects: [],
          summary: {
            totalParties: 0,
            totalProjects: 0,
            totalPromisesFulfilled: 0
          }
        }
      });
    }

    // Format party data
    const partyPerformance = parties.map((party) => ({
      name: party.name,
      shortName: party.shortName || '',
      symbol: party.symbol || '🏛️',
      billsPassed: party.metrics?.billsPassed || 0,
      budgetUtilized: party.metrics?.budgetUtilized || 0,
      projectsCompleted: party.metrics?.projectsCompleted || 0,
      promisesFulfilled: party.metrics?.promisesFulfilled || 0,
      attendance: party.metrics?.parliamentAttendance || 0
    }));

    // Get all projects
    const allProjects = [];
    parties.forEach((party) => {
      if (party.projects && party.projects.length > 0) {
        party.projects.forEach((project) => {
          allProjects.push({
            ...project.toObject ? project.toObject() : project,
            party: party.name
          });
        });
      }
    });

    // Calculate summary
    const totalPromisesFulfilled = parties.reduce((acc, party) => {
      return acc + (party.metrics?.promisesFulfilled || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        partyPerformance,
        projects: allProjects,
        summary: {
          totalParties: parties.length,
          totalProjects: allProjects.length,
          totalPromisesFulfilled
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Seed party data
// @route   POST /api/dashboard/seed
const seedParties = async (req, res) => {
  try {
    const partiesData = [
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

    // Clear existing parties
    await Party.deleteMany({});
    
    // Insert new parties
    for (const party of partiesData) {
      await Party.create(party);
    }

    res.json({ 
      success: true, 
      message: 'Parties seeded successfully',
      count: partiesData.length
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = { getDashboardData, seedParties };