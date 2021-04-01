const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const crypto = require("crypto");
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    keyFilename: './serviceAccount.json'
});
const bucket = storage.bucket(process.env.CLOUD_BUCKET);

const request = require("request");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(fileUpload({ createParentPath: true }))

const CHAINLINK_ACCESS_KEY = process.env.CHAINLINK_ACCESS_KEY;
const CHAINLINK_ACCESS_SECRET = process.env.CHAINLINK_ACCESS_SECRET;
const CHAINLINK_IP = process.env.CHAINLINK_IP;
const CHAINLINK_JOB_ID = process.env.CHAINLINK_JOB_ID;

const job_ids = []

/** Health check endpoint */
app.get('/', (req, res) => {
    res.sendStatus(200);
})

app.post('/submit', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            
            const image = req.files.image;
            const message = req.body.message;
            const imageData = image.data;
            const title = req.body.title;
            const desc = req.body.desc;
            const owner = req.body.owner;

            const imageId = await writeImageBufferToBucket(imageData);

            const response = await callChainlinkNode(CHAINLINK_JOB_ID, imageId, message, title, desc, owner);

            // Get something from response?

            //send response
            res.send({
                status: true,
                message: message,
                id: imageId
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
})


/** Called by chainlink node when a job is created using this external initiator */
app.post('/jobs', (req, res) => {
    //Recieves info from node about the job id
    job_ids.push(req.body.jobId) //save the job id
    res.sendStatus(200);
})


/** Function to call the chainlink node and run a job */
const callChainlinkNode = async (job_id, id, message, title, desc, owner) => {
    const url_addon = '/v2/specs/' + job_id + '/runs'
    const response = await request.post({
        headers: {
            'content-type': 'application/json', 'X-Chainlink-EA-AccessKey': CHAINLINK_ACCESS_KEY,
            'X-Chainlink-EA-Secret': CHAINLINK_ACCESS_SECRET
        },
        url: CHAINLINK_IP + url_addon,
        json: true,
        body: {
            fileId: id,
            message: message,
            title: title,
            desc: desc,
            func: 'encode',
            owner: owner
        }
    });

    console.log("Job Sent");
    return response;
}

const writeImageBufferToBucket = async (buffer) => {
    const id = crypto.randomBytes(20).toString('hex').toString();
    const file = bucket.file(id);
    await file.save(buffer);
    return id;
}

const server = app.listen(process.env.PORT || 3002, () => {
    const port = server.address().port;
    console.log("App now running on port", port);
});