const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;
const FormData = require('form-data');


// URL of the Flask service
const flaskServiceUrl = 'http://localhost:5000';

app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static('public'));

app.post('/api/add-relationship', async (req, res) => {
    try {
        await axios.post(`${flaskServiceUrl}/api/add-relationship`, req.body);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send('Error adding relationship');
    }
});

app.post('/api/upload-csv', async (req, res) => {
    console.log('Received a request to upload a CSV file');
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded.');
        return res.status(400).send('No files were uploaded.');
    }

    const csvFile = req.files.file;
    const filePath = `./uploads/${csvFile.name}`;
    console.log(`File uploaded: ${csvFile.name}`);

    csvFile.mv(filePath, async (err) => {
        if (err) {
            console.error('Error moving file:', err);
            return res.status(500).send(err);
        }

        try {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));

            console.log('Forwarding file to Flask service...');
            const response = await axios.post(`${flaskServiceUrl}/api/upload-csv`, formData, {
                headers: formData.getHeaders()
            });

            console.log('File successfully forwarded to Flask service');
            console.log('Flask response:', response.data);
            res.sendStatus(200);
        } catch (error) {
            console.error('Error uploading CSV:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
            res.status(500).send('Error uploading CSV');
        }
    });
});

app.get('/api/query-graph', async (req, res) => {
    try {
        const response = await axios.get(`${flaskServiceUrl}/api/query-graph`, {
            params: { query: req.query.query },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error querying graph');
    }
});

app.get('/api/get-graph', async (req, res) => {
    try {
        const response = await axios.get(`${flaskServiceUrl}/api/get-graph`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error getting graph');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
