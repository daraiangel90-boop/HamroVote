const { ethers } = require("hardhat");

async function main() {
  const voting = await ethers.getContractAt(
    "Voting",
    "0xC60E69d4500A16a56448e68cCde77109C06311Fa"
  );

  const tx = await voting.vote(0);

  await tx.wait();

  console.log("Vote cast successfully!");
}

main().catch(console.error);