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

const uriToIpfs = async (ipfs, uri) => {
    const resImage = ImageDataURI.decode(uri);
    const result = await ipfs.add(resImage.dataBuffer);

    const imageUrl = `https://ipfs.io/ipfs/${result.cid}`;
    const imageCid = `${result.cid}`;

    return { imageUrl, imageCid };
}

const buildMetadata = (url, title, desc) => {
    const metadata = {
        'name': title,
        'description': desc,
        'image': url
    };

    return JSON.stringify(metadata);
}

const encodeImage = async (jobRunID, ipfs, args) => {
    const id = args[0];
    const message = args[1];
    const title = args[2];
    const desc = args[3];
    const ownerAddress = args[4];

    try {
        const imageBuffer = await getBufferFromBucket(id);
        const cipher = await encrpytBuffer(message);
        const dataUri = await sg.encode(cipher, imageBuffer);

        const { imageUrl, imageCid } = await uriToIpfs(ipfs, dataUri);
        const metadata = buildMetadata(imageUrl, title, desc);

        const txHash = await sendTx(ownerAddress, metadata);

        await ipfs.stop();

        return {
            jobRunID: jobRunID,
            data: { "fileId": id, "metadata": metadata, "cid": imageCid, "txHash": txHash },
            result: txHash,
            statusCode: 200
        }

    } catch (e) {
        console.log(e.message);

        await ipfs.stop();

        return {
            jobRunID: jobRunID,
            data: { "fileId": id, "metadata": {}, "cid": '', "txHash": '0x0' },
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

