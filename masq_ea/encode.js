const IPFS = require('ipfs-core');

const sg = require('./steganography/steganography');
const fs = require('fs');
const ImageDataURI = require('image-data-uri');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: '/workspace/serviceAccount.json'
});
const bucket = storage.bucket('gs://masquerade');


const Canvas = require('canvas');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

global.document = new JSDOM(`...`).window.document;
global.Image = Canvas.Image;

const uriToIpfs = async (ipfs, uri) => {
    const resImage = ImageDataURI.decode(uri);
    const result = await ipfs.add(resImage.dataBuffer);

    return `https://ipfs.io/ipfs/${result.cid}`;
}

const buildAndDeployMetadata = async (ipfs, url, title, desc) => {
    const metadata = {
        'name': title,
        'description': desc,
        'image': url
    };

    const result = await ipfs.add(metadata);
    return `https://ipfs.io/ipfs/${result.cid}`;
}


const encodeImage = async (jobRunID, args) => {
    const id = args[0];
    const message = args[1];
    const title = args[2];
    const desc = args[3];

    const imageBuffer = await getBufferFromBucket(id);
    const dataUri = await sg.encode(message, imageBuffer);

    const ipfs = await IPFS.create();
    const url = await uriToIpfs(ipfs, dataUri);
    const metadataUrl = await buildAndDeployMetadata(ipfs, url, title, desc);


    return {
        jobRunID: jobRunID,
        data: { "fileId": id, "url": metadataUrl, "result": metadataUrl },
        result: metadataUrl,
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

module.exports.encodeImage = encodeImage;


/*

--- TODO ---
- Migrate to cloud function.
- Implement HSM keyring.
- Encode string buffer with HSM key.
- Return CID.

*/

