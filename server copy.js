const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { parse } = require('csv-parse');
const fs = require('fs');
const app = express();
const port = 3000;

// Data storage
let graph = {
    nodes: [],
    edges: []
};

app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static('public'));

app.post('/api/add-relationship', (req, res) => {
    const { entity1, relationship, entity2 } = req.body;
    addRelationship(entity1, relationship, entity2);
    res.sendStatus(200);
});

app.post('/api/upload-csv', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const csvFile = req.files.file;
    const filePath = `./uploads/${csvFile.name}`;

    csvFile.mv(filePath, (err) => {
        if (err) return res.status(500).send(err);

        fs.createReadStream(filePath)
            .pipe(parse({ columns: true }))
            .on('data', (row) => {
                addRelationship(row.entity1, row.relationship, row.entity2);
            })
            .on('end', () => {
                res.sendStatus(200);
            });
    });
});

app.get('/api/query-graph', (req, res) => {
    const query = req.query.query;
    const result = queryGraph(query);
    res.json(result);
});

app.get('/api/get-graph', (req, res) => {
    res.json(graph);
});

function addRelationship(entity1, relationship, entity2) {
    if (!graph.nodes.find(node => node.id === entity1)) {
        graph.nodes.push({ id: entity1, label: entity1 });
    }
    if (!graph.nodes.find(node => node.id === entity2)) {
        graph.nodes.push({ id: entity2, label: entity2 });
    }
    graph.edges.push({ from: entity1, to: entity2, label: relationship });
}

function queryGraph(query) {
    return graph.edges.filter(edge => 
        edge.from.includes(query) || edge.to.includes(query) || edge.label.includes(query)
    );
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

