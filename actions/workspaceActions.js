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
                dispatch({ type: types.EMPTY_REQUEST_APPROVAL });
                resultCB('Requests', error);
            });
    }
}

/**
 * Fetch the List of Transfers that needs Approval (still open)
 * @param {String} token: User's session token
 * @param {String} userName: User's ID 
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getTransferApproval(token, userName, resultCB) {
    let endpoint = '/api/v1/cbn/inventory/GetFormTransfer';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    let body = {
        "TransferInput": [
            {
                "UserCode": userName,
                "search": "",
                "LocId": "ALL"
            }
        ]
    };

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, body)
            .then((json) => {
                dispatch({ type: types.RECEIVE_TRANSFER_APPROVAL, transferApprovalList: json.data });
                resultCB('Transfers', 'Authenticated');
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_TRANSFER_LIST });
                resultCB('Transfers', error);
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
