const { Validator } = require('@chainlink/external-adapter')

const encodeImage = require('./encode').encodeImage;
const decodeImage = require('./decode').decodeImage;

const customParams = {
  func: ['func'],
  fileId: ['fileId'],
  message: ['message'],
  title: ['title'],
  desc: ['desc'],
  url: false
}

const createRequest = async (input, callback) => {

  let inputFormat = {
    ...input,
    ...input.data
  };

  // The Validator helps you validate the Chainlink request xtata
  const validator = new Validator(inputFormat, customParams)

  const encodeParams = [validator.validated.data.fileId, validator.validated.data.message, validator.validated.data.title, validator.validated.data.desc];
  const decodeParams = [validator.validated.data.url];

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

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest
