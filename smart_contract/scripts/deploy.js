// smart_contract/scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Voting Contract...");
  console.log("📡 Network:", hre.network.name);
  
  // Candidate data (matching your backend)
  const candidateNames = [
    "Ram Prasad Sharma",
    "Khadga Prasad Oli",
    "Sher Bahadur Deuba",
    "Bishnu Paudel"
  ];
  
  const parties = [
    "Nepali Congress",
    "CPN-UML",
    "Nepali Congress",
    "CPN-Maoist"
  ];
  
  // Get the contract factory
  const Voting = await hre.ethers.getContractFactory("Voting");
  
  // Deploy the contract
  console.log("⏳ Deploying...");
  const voting = await Voting.deploy(candidateNames, parties);
  await voting.waitForDeployment();
  
  const contractAddress = await voting.getAddress();
  console.log(`✅ Voting contract deployed to: ${contractAddress}`);
  console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`);
  
  // Get initial state
  const isOpen = await voting.isVotingOpen();
  console.log(`📊 Voting is ${isOpen ? "OPEN" : "CLOSED"}`);
  
  // Save address to file (optional)
  const fs = require('fs');
  fs.writeFileSync('./contract-address.txt', contractAddress);
  console.log(`📝 Contract address saved to contract-address.txt`);
  
  return contractAddress;
}

// Run deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });