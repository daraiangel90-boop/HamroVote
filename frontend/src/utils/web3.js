// frontend/src/utils/web3.js
import { ethers } from 'ethers';
import VotingABI from '../contracts/Voting.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const getProvider = () => {
  if (!window.ethereum) {
    console.error('MetaMask not installed');
    return null;
  }
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) return null;
  return await provider.getSigner();
};

export const getContract = (signer) => {
  if (!CONTRACT_ADDRESS) {
    console.error('Contract address not set in .env');
    return null;
  }
  return new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, signer);
};

// ✅ CAST VOTE
export const castVote = async (signer, candidateId) => {
  try {
    const contract = getContract(signer);
    if (!contract) throw new Error('Contract not found');
    const tx = await contract.vote(candidateId);
    const receipt = await tx.wait();
    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error casting vote:', error);
    return { success: false, error: error.message };
  }
};


export const hasVoted = async (signer) => {
  try {
    const contract = getContract(signer);
    if (!contract) return false;
    const address = await signer.getAddress();
    return await contract.hasVoted(address);
  } catch (error) {
    console.error('Error checking vote status:', error);
    return false;
  }
};

export const getCandidates = async (signer) => {
  try {
    const contract = getContract(signer);
    if (!contract) return [];
    const candidates = await contract.getCandidates();
    return candidates.map((c) => ({
      id: Number(c.id),
      name: c.name,
      party: c.party,
      voteCount: Number(c.voteCount)
    }));
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }
};