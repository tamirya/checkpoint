const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const fileType = require('file-type');
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {

    const url = req.query.checkUrl;
    const mimeTypeClient = req.query.mimeTypeClient;

    if (!url) {
        return res.json({msg: 'No URL'});
    }

    const checkUrl = url.includes('https') ? https : http;
    checkUrl.get(url, (resp) => {

        let isFileExecutable = false;

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            if (fileType(chunk)) {
                // check for Executable Files
                const checkFile = fileType(chunk);
                if (checkFile.mime.includes('application')) {
                    isFileExecutable = true;
                }
                resp.destroy();
            }else {
                isFileExecutable = mimeTypeClient.includes('application');
            }
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            if (isFileExecutable) {
                return res.json({msg: 'Not Allowed'});
            } else {
                return res.json({msg: 'Allowed'});
            }
        });

    }).on("error", (err) => {
        return res.json("Error: " + err.message);
    });

});

app.listen(3000);