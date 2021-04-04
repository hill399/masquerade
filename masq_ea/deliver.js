const request = require('request');

const { Requester } = require('@chainlink/external-adapter');

const customError = (data) => {
    if (data.Response === 'Error') return true
    return false
}

const buildRequestOptions = (tokenId, chatId, message) => {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    const preMessage = `
    Thanks for using masquerade!\nYour NFT - ID: ${tokenId} - has been redeemed. The token contained the following message: \n\n
    `;

    const fullMessage = preMessage + message;

    const params = {
        chat_id: chatId,
        text: fullMessage
    };

    const options = {
        url: url,
        params: params,
    }

    return options;
}

const deliverMessage = async (jobRunID, tokenId, chatId, message) => {

    const config = buildRequestOptions(tokenId, chatId, message);

    const res = await Requester.request(config, customError)
        .then(response => {
            if (response.data.ok) {
                return {
                    jobRunID: jobRunID,
                    data: { "success": true, "chatId": chatId, "tokenId": tokenId },
                    result: tokenId,
                    statusCode: response.status
                };
            } else {
                return {
                    jobRunID: jobRunID,
                    data: { "success": false, "chatId": chatId, "tokenId": tokenId },
                    result: 0,
                    statusCode: 500
                };
            }
        })

    return res;
}

module.exports.deliverMessage = deliverMessage;

