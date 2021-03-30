const encrpytBuffer = require('./encrypt').encrpytBuffer;

const IPFS = require('ipfs-core');

const sg = require('./steganography/steganography');
const fs = require('fs');
const ImageDataURI = require('image-data-uri');

const Contract = require('web3-eth-contract');
const masqueradeABI = require('./Masquerade.json');
const web3 = require('web3');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: './serviceAccount.json'
});

const bucket = storage.bucket(process.env.CLOUD_BUCKET);

const Canvas = require('canvas');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

global.document = new JSDOM(`...`).window.document;
global.Image = Canvas.Image;

const uriToIpfs = async (ipfs, uri) => {
    const resImage = ImageDataURI.decode(uri);
    const result = await ipfs.add(resImage.dataBuffer);

    const imageUrl = `https://ipfs.io/ipfs/${result.cid}`;
    const imageCid = `${result.cid}`;

    return {imageUrl, imageCid};
}

const buildMetadata = (url, title, desc) => {
    const metadata = {
        'name': title,
        'description': desc,
        'image': url
    };

    return  JSON.stringify(metadata);
}

const encodeImage = async (jobRunID, args) => {
    const id = args[0];
    const message = args[1];
    const title = args[2];
    const desc = args[3];
    const ownerAddress = args[4];

    const imageBuffer = await getBufferFromBucket(id);
    const cipher = await encrpytBuffer(message);
    const dataUri = await sg.encode(cipher, imageBuffer);

    const ipfs = await IPFS.create();
    const {imageUrl, imageCid} = await uriToIpfs(ipfs, dataUri);
    const metadata = buildMetadata(imageUrl, title, desc);

    const responseData = buildResponseABI(ownerAddress, metadata);

    return {
        jobRunID: jobRunID,
        data: { "fileId": id, "metadata": metadata, "cid": imageCid,  "result": responseData },
        result: responseData,
        statusCode: 200
    }
}


const getBufferFromBucket = async (id) => {
    try {
        const file = bucket.file(id);
        const data = await file.download();
        return Buffer.from(data[0]);
    } catch (err) {
        console.log(err.message);
    }
};


const buildResponseABI = (address, metadata) => {
    const contract = new Contract(masqueradeABI, '0xfc3AdEecae0B362F6dBAb1C32230c77fcc8068F4');
    const contractData = contract.methods.mintNFT(address, metadata).encodeABI();
    return contractData;
}


module.exports.encodeImage = encodeImage;

