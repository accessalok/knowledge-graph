import pandas as pd

def add_relationship(graph, entity1, relationship, entity2):
    if not any(node['id'] == entity1 for node in graph['nodes']):
        graph['nodes'].append({"id": entity1, "label": entity1})
    if not any(node['id'] == entity2 for node in graph['nodes']):
        graph['nodes'].append({"id": entity2, "label": entity2})
    graph['edges'].append({"from": entity1, "to": entity2, "label": relationship})

def query_graph(graph, query):
    return [edge for edge in graph['edges'] if query in edge['from'] or query in edge['to'] or query in edge['label']]

def process_csv(file_path, graph):
    df = pd.read_csv(file_path)
    for _, row in df.iterrows():
        add_relationship(graph, row['entity1'], row['relationship'], row['entity2'])

