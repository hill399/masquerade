
const main = async () => {

  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Masquerade = await ethers.getContractFactory("Masquerade");
  const masqueradeContract = await Masquerade.deploy("0x38D0f0d939E24693454267D0C1fBCD0EE91fE96c");

  console.log("Masquerade address:", masqueradeContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });