from flask import Flask, request, jsonify
from services import add_relationship, query_graph, process_csv
from flask_cors import CORS
import networkx as nx


app = Flask(__name__)
CORS(app)  # To handle CORS if needed

# Data storage
graph = {
    "nodes": [],
    "edges": []
}

@app.route('/api/add-relationship', methods=['POST'])
def add_relationship_route():
    data = request.get_json()
    entity1 = data['entity1']
    relationship = data['relationship']
    entity2 = data['entity2']
    add_relationship(graph, entity1, relationship, entity2)
    return '', 200

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv_route():
    if 'file' not in request.files:
        return 'No files were uploaded.', 400

    csv_file = request.files['file']
    file_path = f'./uploads/{csv_file.filename}'
    print(file_path)
    csv_file.save(file_path)

    process_csv(file_path, graph)
    return '', 200

@app.route('/api/query-graph', methods=['GET'])
def query_graph_route():
    query = request.args.get('query')
    result = query_graph(graph, query)
    return jsonify(result)

@app.route('/api/get-graph', methods=['GET'])
def get_graph_route():
    return jsonify(graph)

if __name__ == '__main__':
    app.run(debug=True)