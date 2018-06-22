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

export function getAvailableMenu(token){
    let endpoint = '/api/v1/user/menu';

    let header = {
        "Authorization": "Bearer " + token,
        "Cache-Control": "no-cache",
    }

    return dispatch => {

        return fetchAPI(endpoint, 'GET', header, null)
            .then((json) => {
                dispatch({ type: types.RECEIVE_MENU, menu: json.data });
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_MENU });
            });
    }
}

/**
 * Fetch the List of Requests that needs Approval (still open)
 * @param {String} token: User's session token
 * @param {String} userName: User's ID 
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getRequestApproval(token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetRequestVerification?DeptCode=PRC&StafCode=ekow';

    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + token
    }

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, null)
            .then((json) => {
                dispatch({ type: types.RECEIVE_REQUEST_APPROVAL, requestApprovalList: json.data });
                resultCB('Requests', 'Authenticated');
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_APPROVAL_LIST });
                resultCB('Requests', error);
            });
    }
}

/**
 * Fetch the whole List of Requests
 * @param {String} token: User's session token
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getRequestView(token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetRequestVerification?DeptCode=PRC&StafCode=ekow';

    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + token
    }

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, null)
            .then((json) => {
                dispatch({ type: types.RECEIVE_REQUEST_VIEW, requestViewList: json.data });
                resultCB('Requests', 'Authenticated');
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_VIEW_LIST });
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
                dispatch({ type: types.RECEIVE_DETAILS, details: json.data });
                resultCB('Success');
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_DETAILS });
                resultCB(error);
            });
    }
}
