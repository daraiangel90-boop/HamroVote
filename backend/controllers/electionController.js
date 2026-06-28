// backend/controllers/electionController.js
const Election = require('../models/Election');
const Vote = require('../models/Vote');

// @desc    Get election results
// @route   GET /api/election/results
// @access  Private
const getResults = async (req, res) => {
  try {
    // Get active election
    const election = await Election.findOne({ isActive: true });
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'No active election found'
      });
    }

    // Get all confirmed votes for this election
    const votes = await Vote.find({
      electionId: election._id,
      status: 'confirmed'
    });

    // Count votes per candidate
    const candidateResults = election.candidates.map(candidate => {
      const voteCount = votes.filter(v =>
        v.candidateId === candidate.id
      ).length;

      return {
        id: candidate.id,
        name: candidate.name,
        party: candidate.party,
        symbol: candidate.symbol || '🏛️',
        voteCount: voteCount
      };
    });

    // Sort by vote count (descending)
    candidateResults.sort((a, b) => b.voteCount - a.voteCount);

    const totalVotes = votes.length;
    const voterTurnout = totalVotes > 0 ? Math.round((totalVotes / 1000) * 100) : 0;

    res.json({
      success: true,
      data: {
        election: {
          title: election.title,
          description: election.description,
          startDate: election.startDate,
          endDate: election.endDate,
          totalVotes: election.totalVotes || totalVotes
        },
        results: candidateResults,
        isResultsVisible: new Date() > election.endDate,
        summary: {
          totalVotes,
          voterTurnout,
          winner: candidateResults.length > 0 ? candidateResults[0] : null,
          winningParty: candidateResults.length > 0 ? candidateResults[0]?.party : null,
          winningMargin: candidateResults.length > 1
            ? candidateResults[0].voteCount - candidateResults[1].voteCount
            : 0
        }
      }
    });
  } catch (error) {
    console.error('Results error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a demo election (for testing)
// @route   POST /api/election/create-demo
// @access  Private (Admin only)
const createDemoElection = async (req, res) => {
  try {
    const election = await Election.create({
      title: "Presidential Election 2024",
      description: "Vote for your preferred candidate",
      candidates: [
        { id: 0, name: "Ram Prasad Sharma", party: "Nepali Congress", symbol: "🌲" },
        { id: 1, name: "Khadga Prasad Oli", party: "CPN-UML", symbol: "☀️" },
        { id: 2, name: "Sher Bahadur Deuba", party: "Nepali Congress", symbol: "🌳" },
        { id: 3, name: "Bishnu Paudel", party: "CPN-Maoist", symbol: "🔴" }
      ],
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true,
      totalVotes: 0
    });

    res.json({
      success: true,
      message: 'Demo election created',
      data: election
    });
  } catch (error) {
    console.error('Create election error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync blockchain votes to database
// @route   POST /api/election/sync-votes
// @access  Private (Admin)
const syncBlockchainVotes = async (req, res) => {
  try {
    // Get active election
    const election = await Election.findOne({ isActive: true });
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'No active election found'
      });
    }

    // Get votes from database
    const votes = await Vote.find({
      electionId: election._id,
      status: 'confirmed'
    });

    // Update candidate vote counts
    const updatedCandidates = election.candidates.map(candidate => {
      const voteCount = votes.filter(v =>
        v.candidateId === candidate.id
      ).length;

      return {
        ...candidate.toObject(),
        voteCount: voteCount
      };
    });

    election.candidates = updatedCandidates;
    election.totalVotes = votes.length;
    await election.save();

    res.json({
      success: true,
      message: 'Votes synced successfully',
      data: {
        totalVotes: votes.length,
        candidates: updatedCandidates
      }
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Record a vote (from Web3)
// @route   POST /api/election/vote
// @access  Private
const recordVote = async (req, res) => {
  try {
    const { electionId, candidateId, txHash } = req.body;

    // Check if user already voted
    const existingVote = await Vote.findOne({
      voterId: req.user.id,
      electionId
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted'
      });
    }

    // Create vote record
    const vote = await Vote.create({
      voterId: req.user.id,
      electionId,
      candidateId,
      txHash,
      status: 'confirmed'
    });

    res.json({
      success: true,
      message: 'Vote recorded',
      data: vote
    });
  } catch (error) {
    console.error('Record vote error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Export all functions
module.exports = {
  getResults,
  createDemoElection,
  syncBlockchainVotes,
  recordVote
};