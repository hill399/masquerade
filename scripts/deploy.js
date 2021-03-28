
const main = async () => {

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Masquerade = await ethers.getContractFactory("Masquerade");
  const masqueradeContract = await Masquerade.deploy("0xA09A06BA9b6973c3D81C470fC4B162De818Aa7eA");

  console.log("Masquerade address:", masqueradeContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });