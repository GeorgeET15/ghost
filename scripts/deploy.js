const hre = require("hardhat");

async function main() {
  const TipOff = await hre.ethers.getContractFactory("TipOff");
  const tipOff = await TipOff.deploy();
  await tipOff.waitForDeployment();

  console.log("TipOff deployed to:", tipOff.target);
  return tipOff.target; // Return address for later use
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
