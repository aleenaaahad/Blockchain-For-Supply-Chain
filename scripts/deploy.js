const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  const TrackShipment = await hre.ethers.getContractFactory("TrackShipment");

  const deployed = await TrackShipment.deploy(); // this creates and sends the transaction

  await deployed.waitForDeployment(); // ✅ REQUIRED in Ethers v6

  const address = await deployed.getAddress(); // ✅ REQUIRED in Ethers v6

  console.log("✅ Contract deployed to:", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
