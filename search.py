from flask import current_app

def add_to_index(index, model):
    if not current_app.elasticsearch:
        return
    payload = {}
    for field in model.__searchable__:
        payload[field] = getattr(model, field)
    current_app.elasticsearch.index(index=index, doc_type=index, id=model.id,
                                    body=payload)

def remove_from_index(index, model):
    if not current_app.elasticsearch:
        return
    current_app.elasticsearch.delete(index=index, doc_type=index, id=model.id)

def query_index(index, query, page, per_page):
    if not current_app.elasticsearch:
        return [], 0
    if query:    
        body={'size': 10000, 'query': {'multi_match': {'query': query, 'fields': ['*'], "lenient": 'true'}}}
    else:
        body={'size': 10000, 'query': {"match_all" : {}}}

    if page and per_page:
        body = {**body, 'from': (page - 1) * per_page, 'size': per_page}      

    search = current_app.elasticsearch.search(index=index, doc_type=index, body=body)
    ids = [int(hit['_id']) for hit in search['hits']['hits']]
    return ids, search['hits']['total']