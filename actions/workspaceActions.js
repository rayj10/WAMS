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
    let endpoint = 'api/v1/cbn/inventory/GetListUserVerification';

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
 * Fetch the List of PO that needs Approval (still pending)
 * @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getPOApproval(token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetFormPO';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    let body = {
        "GetFormPO": [
            {
                "Search": ""
            }
        ]
    }

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                dispatch({ type: types.RECEIVE_PO_APPROVAL, POApprovalList: json.data });
                resultCB('PO', 'Authenticated');
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_PO_APPROVAL });
                resultCB('PO', error);
            });
    }
}

/**
 * Fetch the List of Transfers that needs Approval (still open)
 * @param {String} token: User's session token
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getTransferApproval(token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetFormTransfer';

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
 * Fetch the whole List of PO
 * @param {String} token: User's session token
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getPOView(token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetFormPO';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    let body = {
        "GetFormPO": [
            {
                "Search": ""
            }
        ]
    }

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                dispatch({ type: types.RECEIVE_PO_APPROVAL, requestPOList: json.data });
                resultCB('PO', 'Authenticated');
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_PO_APPROVAL });
                resultCB('PO', error);
            });
    }
}

/**
 * Fetch the whole List of Transfers
 * @param {String} token: User's session token
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getTransferView(token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetFormTransfer';

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
 * @param {String} requestNo: Request to be fetched 
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
                resultCB(json.message);
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_DETAILS });
                resultCB(error);
            });
    }
}

/**
 * Forward a request form to another account
 * @param {String} token: User's session token 
 * @param {String} requestNo: Request number to be forwarded 
 * @param {String} checker: Recipient's user ID 
 * @param {Function} resultCB: Callback to be executed once the process is done 
 */
export function forwardRequest(token, requestNo, checker, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetUpdateForm';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "ListUpdateForm": [
            {
                "RequestNo": requestNo,
                "CheckerCode": checker
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                resultCB(json.message, 'Request Forwarded', 'This request has been successfully forwarded to ');
            })
            .catch((error) => {
                resultCB(error.message);
            });
    }
}

/**
 * Approve/Reject a Request
 * @param {String} token: User's session token  
 * @param {String} requestNo: Request number of interest 
 * @param {String} status: A for Approved and R for Decline 
 * @param {Function} resultCB: Callback to be executed once the process is done 
 * @param {String} notes: Additional note for reason of Declining a Request
 */
export function verifyRequest(token, requestNo, status, resultCB, notes) {
    let endpoint = 'api/v1/cbn/inventory/GetChangeStatus';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "ListChangeStatus": [
            {
                "RequestNo": requestNo,
                "FormStatus": status,
                "ItemStatus": status,
                "Notes": notes ? notes : ""
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                if (status === 'A')
                    resultCB(json.message, 'Request Approved', 'Request APPROVAL has been successful');
                else
                    resultCB(json.message, 'Request Declined', 'Request DECLINE has been successful');
            })
            .catch((error) => {
                resultCB(error.message);
            });
    }
}

/**
 * Fetch the detailed information of a PO
 * @param {String} PONo: PO number of interest 
 * @param {String} token: User's session token  
 * @param {Function} resultCB: Callback to be executed once the fetch is done 
 */
export function getPODetails(PONo, token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetFormAppPO';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "ListPONumber": [
            {
                "PONumber": PONo
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                let details = {};
                if (json.message !== 'error') {
                    details['form'] = json.dataPOForm[0];
                    details['items'] = json.dataPOItem;
                    details['vendor'] = json.dataVendor[0];
                    details['sales'] = json.dataSales[0];
                    dispatch({ type: types.RECEIVE_DETAILS, details });
                    resultCB(json.message);
                }
                else {
                    dispatch({ type: types.EMPTY_DETAILS });
                    resultCB(json.data);
                }
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_DETAILS });
                resultCB(error.message);
            });
    }
}

/**
 * Release the handler on a PO request
 * @param {String} PONo: ID of a PO to be released 
 * @param {String} token: User's Session Token 
 * @param {Function} resultCB: Callback to be executed once the process is done 
 */
export function releasePOhandle(PONo, token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetCancelForm';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "ListPONumber": [
            {
                "PONumber": PONo
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                resultCB(json.message);
            })
            .catch((error) => {
                resultCB(error.message);
            });
    }
}

/**
 * Reject a PO request
 * @param {String} PONo: ID of PO to be rejected 
 * @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once the process is done 
 */
export function rejectPODetails(PONo, token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetRejectPO';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "ListPONumber": [
            {
                "PONumber": PONo
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                resultCB('Successful!', 'PO Rejected Successfully');
            })
            .catch((error) => {
                resultCB(error, error.message);
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
    let endpoint = 'api/v1/cbn/inventory/GetTransferItem';

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
                resultCB(json.message);
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_DETAILS });
                resultCB(error.message);
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
    let endpoint = 'api/v1/cbn/inventory/GetCheckTransferItem';

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
                if (json.message === 'success')
                    resultCB(json.message, json.data[0]['Origin Code'].trimRight(), json.data[0]['TargetCode'].trimRight())
                else
                    resultCB(json.message)
            })
            .catch((error) => {
                resultCB(error.message);
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
    let endpoint = 'api/v1/cbn/inventory/GetInsertConfirm';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "InsertConfirm": [
            {
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
    let endpoint = 'api/v1/cbn/inventory/GetRejectTransfer';

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
                resultCB('Successful!', 'Transfer Denied Successfully');
            })
            .catch((error) => {
                resultCB(error, error.message);
            });
    }
}
