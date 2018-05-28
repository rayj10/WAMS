import { Alert } from 'react-native';

import * as types from './actionTypes/workspaceTypes';
import { fetchAPI } from '../utils/fetch';

/**
 * Lets reducer know that user has signed out
 */
export function successSignOut() {
    return dispatch => {
        dispatch({ type: types.SIGNED_OUT });
    }
}

/**
 * Fetch the List of Requests
 * @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getRequestList(token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetRequestVerification?DeptCode=PRC&StafCode=ekow'

    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + token
    }

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, null)
            .then((json) => {
                dispatch({ type: types.RECEIVE_REQUEST_LIST, requestList : json });
                resultCB('Requests', 'Authenticated');
            })
            .catch((error) => {
                dispatch({ type: types.RECEIVE_EMPTY_REQUEST });
                resultCB('Requests', error);
            });
    }
}

/**
 * Fetch the full details of a request
 * @param {Object} request: Request to be fetched 
 * @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getRequestDetails(request, token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetDetailRequest?RequestNo=' + request['RequestNo'];

    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + token
    }

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, null)
            .then((json) => {
                dispatch({ type: types.RECEIVE_DETAILED_VIEW, request, details: json.data });
                resultCB('Success');
            })
            .catch((error) => {
                dispatch({ type: types.RECEIVE_EMPTY_DETAILS });
                resultCB(error);
            });
    }
}
