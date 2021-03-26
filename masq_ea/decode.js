const decrpytBuffer = require('./encrypt').decrpytBuffer;

const IPFS = require('ipfs-core');

const sg = require('./steganography/steganography');
const fs = require('fs');
const Canvas = require('canvas');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

global.document = new JSDOM(`...`).window.document;
global.Image = Canvas.Image;

const decodeImage = async (jobRunID, args) => {
    const cid = args[0];
    const ipfs = await IPFS.create();

    const stream = ipfs.cat(cid);

    const chunks = [];

    for await (const buffer of stream) {
        chunks.push(buffer)
    }

    const buffer = Buffer.concat(chunks);
    const bCipher = sg.decode(buffer);

    const cipher = Buffer.from(bCipher, 'base64');
    
    const message = await decrpytBuffer(cipher);

    return {
        jobRunID: jobRunID,
        data: { "cid": cid, "complete": true },
        result: true,
        statusCode: 200
    }
}

module.exports.decodeImage = decodeImage;


/*

--- TODO ---
- Add secure message delivery (Telegram?)

*/