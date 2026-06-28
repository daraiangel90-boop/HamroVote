const { ethers } = require("hardhat");

async function main() {

  const contractAddress =
    "0xE1168DecD7004296E489ECb6C9d9EFED65Ff3A62";

  const voting = await ethers.getContractAt(
    "Voting",
    contractAddress
  );

  const isOpen = await voting.isVotingOpen();

  console.log("Voting Open:", isOpen);

}

main().catch(console.error);