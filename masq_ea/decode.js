const decrpytBuffer = require('./encrypt').decrpytBuffer;
const deliverMessage = require('./deliver').deliverMessage;

const sg = require('./steganography/steganography');
const Canvas = require('canvas');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const axios = require("axios");

global.document = new JSDOM(`...`).window.document;
global.Image = Canvas.Image;

const parseTokenURI = async (tokenHash) => {
    const hash = tokenHash.substring(7);
    const response = await axios.get(`https://ipfs.io/ipfs/${hash}`, {
        responseType: 'application/json'
    });

    return (response.data.image);
}


const unpinIpfsData = async (tokenHash) => {
    const metadataHash = tokenHash.substring(7);
    const response = await axios.get(`https://ipfs.io/ipfs/${metadataHash}`, {
        responseType: 'application/json'
    });

    const imageUrl = response.data.image;
    const splitImageUrl = imageUrl.split('/');

    const imageHash = splitImageUrl[splitImageUrl.length - 1];

    await pinata.unpin(imageHash);
    await pinata.unpin(metadataHash);
}



const decodeImage = async (jobRunID, args) => {
    const tokenHash = args[0];
    const tokenId = args[1];
    const chatId = args[2];

    try {
        const imageUrl = await parseTokenURI(tokenHash);

        const ipfsResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });

        const buffer = ipfsResponse.data;
        const bCipher = sg.decode(buffer);

        const cipher = Buffer.from(bCipher, 'base64');
        const message = await decrpytBuffer(cipher);

        const response = await deliverMessage(jobRunID, tokenId, chatId, message);

        await unpinIpfsData(tokenHash);

        return response;

    } catch (e) {
        console.log(e.message);
        
        return {
            jobRunID: jobRunID,
            data: { "success": false, "chatId": chatId, "tokenId": tokenId, "result": 0 },
            result: 0,
            statusCode: 500
        };
    }
}

module.exports.decodeImage = decodeImage;
