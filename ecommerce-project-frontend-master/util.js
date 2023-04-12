function extractFormToBody(form){

    let keyValuePairs = form.serializeArray();

    let body = {};
    for(let tuple of keyValuePairs){

        body[tuple.name] = tuple.value;

    }

    return body;

}

export { extractFormToBody }