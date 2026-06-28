const { ethers } = require("hardhat");

async function main() {
  const voting = await ethers.getContractAt(
    "Voting",
    "0xC60E69d4500A16a56448e68cCde77109C06311Fa"
  );

  const candidates = await voting.getCandidates();

  console.log(candidates);
}

main().catch(console.error);