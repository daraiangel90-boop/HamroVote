// backend/scripts/syncVotes.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { ethers } = require('ethers');
const Election = require('../models/Election');

dotenv.config();

// ✅ FIXED: Remove deprecated options
mongoose.connect(process.env.MONGO_URI);

// ✅ Add connection handlers
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Contract ABI (only the functions we need)
const CONTRACT_ABI = [
  "function getCandidates() external view returns (tuple(uint256 id, string name, string party, uint256 voteCount)[])"
];

async function syncVotes() {
  try {
    console.log('🔄 Syncing votes from blockchain...');
    
    // Check if contract address is set
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.error('❌ CONTRACT_ADDRESS not set in .env');
      process.exit(1);
    }
    
    // Connect to Sepolia
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
    
    // Get candidates from blockchain
    const candidates = await contract.getCandidates();
    console.log('📊 Blockchain candidates:', candidates.map(c => ({
      name: c.name,
      votes: Number(c.voteCount)
    })));
    
    // Find active election
    const election = await Election.findOne({ isActive: true });
    if (!election) {
      console.log('❌ No active election found');
      return;
    }
    
    console.log(`📋 Found election: ${election.title}`);
    
    // Update candidate vote counts
    const updatedCandidates = election.candidates.map((c, index) => {
      const blockchainVotes = Number(candidates[index].voteCount);
      return {
        ...c.toObject(),
        voteCount: blockchainVotes
      };
    });
    
    // Update election
    election.candidates = updatedCandidates;
    election.totalVotes = candidates.reduce((sum, c) => sum + Number(c.voteCount), 0);
    await election.save();
    
    console.log('✅ Votes synced successfully!');
    console.log(`📊 Total votes: ${election.totalVotes}`);
    console.log('📊 Updated candidates:', updatedCandidates.map(c => ({
      name: c.name,
      votes: c.voteCount
    })));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync error:', error);
    process.exit(1);
  }
}

syncVotes();