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
 * Fetch the List of Users to forward the Approval form to
 * @param {String} token: User's session token
 * @param {Function} errorCB: Callback in case fetch failed
 */
export function getForwardList(token, errorCB) {
    let endpoint = '/api/v1/cbn/inventory/GetListUserVerification';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, null)
            .then((json) => {
                dispatch({ type: types.RECEIVE_FORWARD_LIST, forwardList: json.data });
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_FORWARD_LIST });
                errorCB();
            });
    }
}

/**
 * Fetch the List of Requests that needs Approval (still open)
 * @param {String} token: User's session token
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getRequestApproval(token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetRequestVerification';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    let body = {
        "RequestTransferInput": [
            {
                "DepartmentCode": "PRC",
                "Search": ""
            }
        ]
    }

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
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
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getTransferApproval(token, resultCB) {
    let endpoint = '/api/v1/cbn/inventory/GetFormTransfer';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    let body = {
        "TransferInput": [
            {
                "search": "",
                "LocationId": "ALL"
            }
        ]
    };

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                dispatch({ type: types.RECEIVE_TRANSFER_APPROVAL, transferApprovalList: json.data });
                resultCB('Transfers', 'Authenticated');
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_TRANSFER_APPROVAL });
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
    let endpoint = 'api/v1/cbn/inventory/GetRequestVerification';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    let body = {
        "RequestTransferInput": [
            {
                "DepartmentCode": "PRC",
                "Search": ""
            }
        ]
    };

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                dispatch({ type: types.RECEIVE_REQUEST_VIEW, requestViewList: json.data });
                resultCB('Requests', 'Authenticated');
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_REQUEST_VIEW });
                resultCB('Requests', error);
            });
    }
}

/**
 * Fetch the whole List of Transfers
 * @param {String} token: User's session token
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getTransferView(token, resultCB) {
    let endpoint = '/api/v1/cbn/inventory/GetFormTransfer';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    let body = {
        "TransferInput": [
            {
                "search": "",
                "LocationId": "ALL"
            }
        ]
    };

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                dispatch({ type: types.RECEIVE_TRANSFER_VIEW, transferViewList: json.data });
                resultCB('Transfers', 'Authenticated');
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_TRANSFER_VIEW });
                resultCB('Transfers', error);
            });
    }
}

/**
 * Fetch the full details of a Request
 * @param {Object} requestNo: Request to be fetched 
 * @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getRequestDetails(requestNo, token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetDetailRequest?RequestNo=' + requestNo;

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

/**
 * Fetch the full details of a Transfer
 * @param {Object} transferNo: Transfer to be fetched 
 * @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getTransferDetails(transferNo, token, resultCB) {
    let endpoint = '/api/v1/cbn/inventory/GetTransferItem';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "TransferInputNo": [
            {
                "TransferNo": transferNo
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
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

/**
 * Get additional info for confirm/deny transfer 
 * @param {String} token: User's session token 
 * @param {String} transferNo: Transfer number of interest 
 * @param {Function} resultCB: Callback to be executed once fetching process is done 
 */
export function getCheckTransferItem(token, transferNo, resultCB) {
    let endpoint = '/api/v1/cbn/inventory/GetCheckTransferItem';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "TransferInputNo": [
            {
                "TransferNo": transferNo
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                resultCB(json.data[0]['Origin Code'].trimRight(), json.data[0]['TargetCode'].trimRight())
            })
            .catch((error) => {
                resultCB(error);
            });
    }
}

/**
 * Confirm a transfer request for each item, each with their own verification.
 * @param {String} token: User's session token 
 * @param {String} transferNo: Transfer number of interest 
 * @param {String} origin: Origin location code fetched from getCheckTransferItem 
 * @param {String} target: Target location code fetched from getCheckTransferItem 
 * @param {String} itemPieceNo: List (in the form of concat string) of item piece numbers from that particular transfer request 
 * @param {String} itemVerified: List (in the form of concat string) of corresponding item verification for each item piece number 
 * @param {Function} resultCB: Callback to be executed once the API fetch is done 
 */
export function confirmTransferDetails(token, transferNo, origin, target, itemPieceNo, itemVerified, resultCB) {
    let endpoint = '/api/v1/cbn/inventory/GetInsertConfirm';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "InsertConfirm": [
            {
                "Fullname": "",
                "DepartmentCode": "",
                "TransferNo": transferNo,
                "OriginLocation": origin,
                "TargetLocation": target,
                "ItemPieceNo": itemPieceNo,
                "ItemVerified": itemVerified
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                resultCB('Successful!', 'Transfer Confirmation Successful');
            })
            .catch((error) => {
                resultCB(error, error.message);
            });
    }
}

/**
 * Deny a transfer request for every item in the form
 * @param {String} token: User's session token 
 * @param {String} transferNo: Transfer number of interest 
 * @param {Function} resultCB: Callback to be executed once fetching process is done 
 */
export function denyTransferDetails(token, transferNo, resultCB) {
    let endpoint = '/api/v1/cbn/inventory/GetRejectTransfer';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "TransferInputNo": [
            {
                "TransferNo": transferNo
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                resultCB('Successful', 'Transfer Denied Successfully');
            })
            .catch((error) => {
                resultCB(error, error.message);
            });
    }
}
