const encrpytBuffer = require('./encrypt').encrpytBuffer;
const sendTx = require('./sendTx').sendTx;

const sg = require('./steganography/steganography');
const fs = require('fs');
const ImageDataURI = require('image-data-uri');

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

const uriToIpfs = async (pinata, id, uri) => {
    const tempFilePath = `/tmp/${id}.tmp`;

    await ImageDataURI.outputFile(uri, tempFilePath);
    const imageStream = fs.createReadStream(tempFilePath);

    const result = await pinata.pinFileToIPFS(imageStream);

    const imageUrl = `https://ipfs.io/ipfs/${result.IpfsHash}`;
    const imageCid = `${result.IpfsHash}`;

    return { imageUrl, imageCid };
}

const buildAndUploadMetadata = async (pinata, url, title, desc) => {
    const metadata = {
        'name': title,
        'description': desc,
        'image': url
    };

    const result = await pinata.pinJSONToIPFS(metadata, {});
    return `ipfs://${result.IpfsHash}`;
}

const encodeImage = async (jobRunID, pinata, args) => {
    const id = args[0];
    const message = args[1];
    const title = args[2];
    const desc = args[3];
    const ownerAddress = args[4];

    try {
        const imageBuffer = await getBufferFromBucket(id);
        const cipher = await encrpytBuffer(message);
        const dataUri = await sg.encode(cipher, imageBuffer);

        const { imageUrl, imageCid } = await uriToIpfs(pinata, id, dataUri);
        const metadata = await buildAndUploadMetadata(pinata, imageUrl, title, desc);

        const txHash = await sendTx(ownerAddress, metadata);

        return {
            jobRunID: jobRunID,
            data: { "fileId": id, "metadata": metadata, "cid": imageCid, "txHash": txHash, "result": metadata },
            result: metadata,
            statusCode: 200
        }

    } catch (e) {
        console.log(e.message);

        return {
            jobRunID: jobRunID,
            data: { "fileId": id, "metadata": {}, "cid": '', "txHash": '0x0', "result": '0x0' },
            result: '0x0',
            statusCode: 500
        };
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


module.exports.encodeImage = encodeImage;

