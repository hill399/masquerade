// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const hre = require("hardhat");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Masquerade contract", () => {
    // Mocha has four functions that let you hook into the the test runner's
    // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

    // They're very useful to setup the environment for tests, and to clean it
    // up after they run.

    // A common pattern is to declare some variables, and assign them in the
    // `before` and `beforeEach` callbacks.
    let Masquerade;
    let masqueradeContract;
    let owner;
    let node;
    let stranger;
    let linkToken;
    let tokenOwner;

    let tokenUri = {"name":"this is my new nft","description":"this is my nft description","image":"https://ipfs.io/ipfs/QmYxLg9aerxQjVUJi68BNhWNYBiQeJnEDsVJkrB33gGhnZ"};
    
    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    beforeEach(async () => {
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: ["0xE84D601E5D945031129a83E5602be0CC7f182Cf3"]}
        )

        // Get the ContractFactory and Signers here.
        Masquerade = await ethers.getContractFactory("Masquerade");
        [owner, node, stranger] = await ethers.getSigners();
        tokenOwner = await ethers.getSigner("0xE84D601E5D945031129a83E5602be0CC7f182Cf3");

        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.
        masqueradeContract = await Masquerade.deploy(node.address);
        linkToken = await ethers.getContractAt("LinkTokenInterface", "0x326C977E6efc84E512bB9C30f76E30c160eD06FB");
        linkToken.connect(tokenOwner).transfer(owner.address, `${1e18}`);
    });

    // You can nest describe calls to create subsections.
    describe("Deployment", () => {
        it("Should set the right owner", async () => {
            expect(await masqueradeContract.owner()).to.equal(owner.address);
        });

        it("Should set the correct node address", async () => {
            expect(await masqueradeContract.masqueradeNode()).to.equal(node.address);
        });
    });

    describe("Minting", () => {
        it("Should block minting from unknown addresses", async () => {
            await expect(
                masqueradeContract.connect(stranger).mintNFT(stranger.address, tokenUri)
            ).to.be.revertedWith("Not authorised to mint");
        });

        it("Should mint a new NFT if called by the node", async () => {
            await masqueradeContract.connect(node).mintNFT(owner.address, tokenUri);
        });

        it("Should have correct tokenId and tokenUri information", async () => {
            // Check against ERC721 interface for new parameters
        });
/*         it("Should fail if sender doesn’t have enough tokens", async function () {
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

            // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(
                hardhatToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("Not enough tokens");

            // Owner balance shouldn't have changed.
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );
        });

        it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

            // Transfer 100 tokens from owner to addr1.
            await hardhatToken.transfer(addr1.address, 100);

            // Transfer another 50 tokens from owner to addr2.
            await hardhatToken.transfer(addr2.address, 50);

            // Check balances.
            const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

            const addr1Balance = await hardhatToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            const addr2Balance = await hardhatToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        }); */
    });
});