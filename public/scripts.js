// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const relationshipForm = document.getElementById('relationship-form');
    const fileUpload = document.getElementById('file-upload');
    const queryForm = document.getElementById('query-form');

    relationshipForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const entity1 = document.getElementById('entity1').value;
        const relationship = document.getElementById('relationship').value;
        const entity2 = document.getElementById('entity2').value;
        
        await fetch('/api/add-relationship', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entity1, relationship, entity2 }),
        });
        
        updateGraph();
    });

    fileUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        await fetch('/api/upload-csv', {
            method: 'POST',
            body: formData,
        });

        updateGraph();
    });

    queryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = document.getElementById('query').value;

        const response = await fetch(`/api/query-graph?query=${encodeURIComponent(query)}`);
        const result = await response.json();

        const queryResults = document.getElementById('query-results');
        queryResults.innerHTML = JSON.stringify(result, null, 2);
    });

    /*async function updateGraph() {
        const response = await fetch('/api/get-graph');
        const graphData = await response.json();

        console.log(graphData);

        // Visualization code goes here
    }*/

    async function updateGraph() {
        const response = await fetch('/api/get-graph');
        const graphData = await response.json();
    
        const nodes = new vis.DataSet(graphData.nodes);
        const edges = new vis.DataSet(graphData.edges);
        const container = document.getElementById('graph');
        const data = { nodes, edges };
        const options = {};
        new vis.Network(container, data, options);
    }
    

    updateGraph();
});

