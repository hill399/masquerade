const decrpytBuffer = require('./encrypt').decrpytBuffer;
const deliverMessage = require('./deliver').deliverMessage;

const sg = require('./steganography/steganography');
const Canvas = require('canvas');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

global.document = new JSDOM(`...`).window.document;
global.Image = Canvas.Image;

const parseTokenURI = (tokenURI) => {
    const parsedTokenURI = JSON.parse(tokenURI);
    const imageUrl = parsedTokenURI.image;
    const urlSplit = imageUrl.split('/');
    return `/ipfs/${urlSplit[urlSplit.length - 1]}`;
}


const decodeImage = async (jobRunID, ipfs, args) => {
    const tokenURI = args[0];
    const tokenId = args[1];
    const chatId = args[2];

    try {
        const cid = parseTokenURI(tokenURI);

        const stream = ipfs.cat(cid);

        const chunks = [];

        for await (const buffer of stream) {
            chunks.push(buffer)
        }

        const buffer = Buffer.concat(chunks);
        const bCipher = sg.decode(buffer);

        const cipher = Buffer.from(bCipher, 'base64');

        const message = await decrpytBuffer(cipher);

        const response = await deliverMessage(jobRunID, tokenId, chatId, message);

        await ipfs.stop();

        return response;

    } catch (e) {
        console.log(e.message);

        await ipfs.stop();

        return {
            jobRunID: jobRunID,
            data: { "success": false, "chatId": chatId, "tokenId": tokenId },
            result: 0,
            statusCode: 500
        };
    }
}

module.exports.decodeImage = decodeImage;
