const { Validator } = require('@chainlink/external-adapter')

const encodeImage = require('./encode').encodeImage;
const decodeImage = require('./decode').decodeImage;

const customParams = {
  func: ['func'],
  owner: false,
  fileId: false,
  message: false,
  title: false,
  desc: false,
  tokenURI: false,
  tokenId: false,
  chatId: false
}

const createRequest = async (input, callback) => {

  let inputFormat = {
    ...input,
    ...input.data
  };

  // The Validator helps you validate the Chainlink request xtata
  const validator = new Validator(inputFormat, customParams)

  const encodeParams = [validator.validated.data.fileId, validator.validated.data.message, validator.validated.data.title, validator.validated.data.desc, validator.validated.data.owner];
  const decodeParams = [validator.validated.data.tokenURI, validator.validated.data.tokenId, validator.validated.data.chatId];

  const jobRunId = validator.validated.id;

  switch (validator.validated.data.func) {
    case 'encode':
      return encodeImage(jobRunId, encodeParams).then((result) => {
        callback(200, result);
      })

    case 'decode':
      return decodeImage(jobRunId, decodeParams).then((result) => {
        callback(200, result);
      })

    default:
      console.log('Invalid func...')
      callback(400);
  }
}


// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}


// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
