// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const hre = require("hardhat");

describe("Masquerade contract", () => {
    let Masquerade;
    let masqueradeContract;
    let owner;
    let node;
    let stranger;
    let linkToken;
    let tokenOwner;

    let tokenUri = JSON.stringify({ "name": "this is my new nft", "description": "this is my nft description", "image": "https://ipfs.io/ipfs/QmYxLg9aerxQjVUJi68BNhWNYBiQeJnEDsVJkrB33gGhnZ" });

    beforeEach(async () => {
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: ["0xE84D601E5D945031129a83E5602be0CC7f182Cf3"]
        }
        )

        // Get the ContractFactory and Signers here.
        Masquerade = await ethers.getContractFactory("Masquerade");
        [owner, node, stranger] = await ethers.getSigners();
        tokenOwner = await ethers.getSigner("0xE84D601E5D945031129a83E5602be0CC7f182Cf3");

        masqueradeContract = await Masquerade.deploy(node.address);
        linkToken = await ethers.getContractAt("LinkTokenInterface", "0x326C977E6efc84E512bB9C30f76E30c160eD06FB");
        linkToken.connect(tokenOwner).transfer(owner.address, `${1e18}`);
        await masqueradeContract.deployed();
    });

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
            await masqueradeContract.connect(node).mintNFT(owner.address, tokenUri);
            const tokenData = await masqueradeContract.connect(owner).tokenURI(1);
            expect(tokenUri).to.equal(tokenData);
        });
    });

    describe("Transfer", () => {
        it("Should allow tokens to be freely moved", async () => {
            await masqueradeContract.connect(node).mintNFT(owner.address, tokenUri);
            await masqueradeContract.connect(owner).transferFrom(owner.address, stranger.address, 1);
            await masqueradeContract.connect(stranger).transferFrom(stranger.address, node.address, 1);

            const newTokenOwner = await (masqueradeContract.ownerOf(1));
            expect(newTokenOwner).to.equal(node.address);
        });

        it("Should block old owner from accessing owner functions", async () => {
            await masqueradeContract.connect(node).mintNFT(owner.address, tokenUri);
            await masqueradeContract.connect(owner).transferFrom(owner.address, stranger.address, 1);

            await expect(
                masqueradeContract.connect(owner).transferFrom(owner.address, node.address, 1)
            ).to.be.revertedWith("transfer caller is not owner nor approved");
        });

        it("Should block stranger from accessing owner functions", async () => {
            await masqueradeContract.connect(node).mintNFT(owner.address, tokenUri);
            await expect(
                masqueradeContract.connect(stranger).transferFrom(owner.address, stranger.address, 1)
            ).to.be.revertedWith("transfer caller is not owner nor approved");
        });
    });

    describe("Burning", () => {
        it("Should block burning from unknown addresses", async () => {
            const dummyb32 = '0xb3c15a6d94447b6045715e16a2e6dceb196d8ebf4d810acff9768115edb81354';
            await expect(
                masqueradeContract.connect(stranger).fulfillNFTDecode(dummyb32, 1)
            ).to.be.revertedWith("Source must be the oracle of the request");
        });

        it("Should allow burning from oracle address", async () => {
            await masqueradeContract.connect(node).mintNFT(owner.address, tokenUri);
            await masqueradeContract.connect(owner).approve(masqueradeContract.address, 1);

            let tx = await masqueradeContract.connect(owner).requestNFTDecode(node.address, "DUMMY_ID", 1);
            let receipt = await tx.wait();
            let requestId = receipt.events[0].args.id;

            await masqueradeContract.connect(node).fulfillNFTDecode(requestId, 1);
        });

        it("Should burn the target token", async () => {
            await masqueradeContract.connect(node).mintNFT(owner.address, tokenUri);
            await masqueradeContract.connect(owner).approve(masqueradeContract.address, 1);

            let tx = await masqueradeContract.connect(owner).requestNFTDecode(node.address, "DUMMY_ID", 1);
            let receipt = await tx.wait();
            let requestId = receipt.events[0].args.id;

            await masqueradeContract.connect(node).fulfillNFTDecode(requestId, 1);

            await expect(
                masqueradeContract.connect(owner).tokenURI(1)
            ).to.be.revertedWith("URI query for nonexistent token");
        });

        it("Should only allow the owner to burn a token", async () => {
            await masqueradeContract.connect(node).mintNFT(owner.address, tokenUri);
            await masqueradeContract.connect(owner).approve(masqueradeContract.address, 1);

            await expect(
                masqueradeContract.connect(stranger).requestNFTDecode(node.address, "DUMMY_ID", 1)
            ).to.be.revertedWith("Sender is not owner of specified token");
        });
    });
});