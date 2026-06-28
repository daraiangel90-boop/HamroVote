// backend/controllers/syncController.js
const { ethers } = require('ethers');
const Election = require('../models/Election');

const CONTRACT_ABI = [
  "function getCandidates() external view returns (tuple(uint256 id, string name, string party, uint256 voteCount)[])"
];

// @desc    Sync votes from blockchain to database
// @route   POST /api/election/sync-votes
// @access  Private (Admin)
const syncVotes = async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
      return res.status(400).json({
        success: false,
        message: 'Contract address not configured'
      });
    }
    
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
    
    // Get candidates from blockchain
    const candidates = await contract.getCandidates();
    
    // Find active election
    const election = await Election.findOne({ isActive: true });
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'No active election found'
      });
    }
    
    // Update candidate vote counts
    const updatedCandidates = election.candidates.map((c, index) => {
      const blockchainVotes = Number(candidates[index].voteCount);
      return {
        ...c.toObject(),
        voteCount: blockchainVotes
      };
    });
    
    election.candidates = updatedCandidates;
    election.totalVotes = candidates.reduce((sum, c) => sum + Number(c.voteCount), 0);
    await election.save();
    
    res.json({
      success: true,
      message: 'Votes synced successfully',
      data: {
        totalVotes: election.totalVotes,
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

module.exports = { syncVotes };