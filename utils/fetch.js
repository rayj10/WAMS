import _ from 'lodash';

/**
 * All-purpose fetch function to be used to interact with API
 * @param {String} endpoint: URL endpoint to be accessed
 * @param {String} method: Typically POST or GET  
 * @param {Object} header: Typically contains Authorization details and Content-type 
 * @param {Object} data: Typically contains Parameters for the request 
 * @param {String} site: optional url if there is a different one
 */
export function fetchAPI(endpoint, method, header, data, site) {
    let url = (site ? site : 'http://10.64.2.149:8082/') + endpoint;

    let options = {
        method: method,
        headers: header,
        body: data
    };

    return fetch(url, options)
        .then(response => {
            return response.json()
                .then((json) => {
                    if (response.status === 200 || response.status === 201)
                        return json;
                    else
                        throw response.status
                })
        })
        .catch(error => {
            if (typeof error.message !== 'undefined')
                throw (error.message);
            else if (typeof error === 'number' || typeof error === 'string')
                throw (error);
            else if (Object.keys(error)) {
                let errStr = '';
                let errors = _.omit(error, ['column', 'line', 'sourceURL'])

                _.forEach(errors, function (value) {
                    errStr += value + '.\n';
                });
                throw (errStr);
            }
            else
                throw ('Unknown Error');
        });
}

module.exports = { fetchAPI };
