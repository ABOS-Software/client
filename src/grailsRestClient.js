import {restClient} from 'ra-data-feathers';
import feathersClient from './feathersClient';

export default restClient(feathersClient, {});

export const GET_PLAIN_MANY = "GET_PLAIN_MANY";


/*import {CREATE, DELETE, fetchUtils, GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE, UPDATE,} from 'react-admin';
import hostURL from "./host";

export const GET_PLAIN_MANY = "GET_PLAIN_MANY";
const apiUrl = hostURL;

export default (httpClient = fetchUtils.fetchJson) => {
    const makeFilters = filters => {
        let filterString = '';
        Object.keys(filters).map(function (key, index) {
            let value = filters[key];
            if (filterString !== '') {
                filterString += '&';
            }
            filterString += `${key}=${value}`;
        });


        return filterString + '';
    };

    const makeParam = params => {
        let param = ``;
        const {page, perPage} = params.pagination;
        const {field, order} = params.sort;
        // TODO: handle filter
        if (field) {
            param += `$sort[${field}]`;
            if (order) {
                if (order === "DESC") {
                    param += `=1`;
                } else {
                    param += `=-1`;

                }

            } else {
                param += `=-1`;

            }
            param += `&`;

        }
        if (perPage) {
            param += `$limit=${perPage}&`;

        }
        if (page) {
            param += `$skip=${(page - 1) *
            perPage}&`;

        }
        if (params.filter) {
            param += `${makeFilters(params.filter)}`;

        }
        return param;
    };

    /!**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     *!/
    const convertRESTRequestToHTTP = (type, resource, params) => {
        let url = '';
        const options = {};
        switch (type) {
            case GET_LIST: {
                url = `${apiUrl}/${resource}?${makeParam(params)}`;
                break;
            }
            case GET_ONE:
                url = `${apiUrl}/${resource}/${params.id}`;
                break;
            case GET_MANY: {
                url = `${apiUrl}/${resource}`;
                break;
            }
            case GET_PLAIN_MANY: {
                url = `${apiUrl}/${resource}?q=${makeFilters(params.filter)}`;
                break;
            }
            case GET_MANY_REFERENCE: {
                url = `${apiUrl}/${resource}?${makeParam(params)}`;
                break;
            }
            case UPDATE:
                url = `${apiUrl}/${resource}/${params.id}`;
                options.method = 'PUT';
                options.body = JSON.stringify(params.data);
                break;
            case CREATE:
                url = `${apiUrl}/${resource}`;
                options.method = 'POST';
                options.body = JSON.stringify(params.data);
                break;
            case DELETE:
                url = `${apiUrl}/${resource}/${params.id}`;
                options.method = 'DELETE';
                break;
            default:
                throw new Error(`Unsupported fetch action type ${type}`);
        }
        return {url, options};
    };

    /!**
     * @param {Object} response HTTP response from fetch()
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The REST request params, depending on the type
     * @returns {Object} REST response
     *!/
    const convertHTTPResponseToREST = (response, type, resource, params) => {
        const {headers, json} = response;
        switch (type) {
            case GET_LIST:
            case GET_MANY_REFERENCE:
            case GET_MANY:
            case GET_PLAIN_MANY:
                /!*
                if (!headers.has('content-range')) {
                  throw new Error(
                    'The Content-Range header is missing in the HTTP Response. The simple REST client expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?'
                  );
                }
                *!/
                return {
                    data: json.data,
                    total: parseInt(json.total, 10),
                };
            case CREATE:
                return {data: {json, id: json.id}};
            case DELETE:
                return {data: {json}};
            default:
                return {data: json};
        }
    };

    /!**
     * @param {string} type Request type, e.g GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Request parameters. Depends on the request type
     * @returns {Promise} the Promise for a REST response
     *!/
    return (type, resource, params) => {
        const {url, options} = convertRESTRequestToHTTP(type, resource, params);

        return httpClient(url, options).then(response => {
            return convertHTTPResponseToREST(response, type, resource, params);
        });
    };
};*/
