const IPFS = require('ipfs-core');

const sg = require('./steganography/steganography');
const fs = require('fs');
const Canvas = require('canvas');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

global.document = new JSDOM(`...`).window.document;
global.Image = Canvas.Image;

const decodeImage = async (args) => {
    const cid = args[0];
    const ipfs = await IPFS.create();

    const stream = ipfs.cat(cid);
    const chunks = [];

    for await (const buffer of stream) {
        chunks.push(buffer)
    }

    const buffer = Buffer.concat(chunks);
    const res = sg.decode(buffer);

    return res;
}

module.exports.decodeImage = decodeImage;


/*

--- TODO ---
- Migrate to cloud function.
- Implement HSM keyring.
- Decode image.
- Decode string with HSM key.
- Return CID.

*/