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
 * Fetch the List of Users to forward the Request form Approval to
 * @param {String} token: User's session token
 */
export function getForwardList(token) {
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
            });
    }
}

/**
 * Fetch the List of Requests that needs Approval (status Open)
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
                resultCB('Requests', json.message);
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_REQUEST_APPROVAL });
                resultCB('Requests', error);
            });
    }
}

/**
 * Fetch the List of PO that needs Approval (status Open)
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
                resultCB('PO', json.message);
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_PO_APPROVAL });
                resultCB('PO', error);
            });
    }
}

/**
 * Fetch the List of Transfers that needs Approval (status Open)
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
                resultCB('Transfers', json.message);
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_TRANSFER_APPROVAL });
                resultCB('Transfers', error);
            });
    }
}

/**
 * Fetch the whole List of Requests for user's department
 * @param {String} token: User's session token
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getRequestView(token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetViewRequest';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    let body = {
        "ListViewRequest": [
            {
                "Request": "1"
            }
        ]
    };

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                dispatch({ type: types.RECEIVE_REQUEST_VIEW, requestViewList: json.data });
                resultCB('Requests', json.message);
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_REQUEST_VIEW });
                resultCB('Requests', error);
            });
    }
}

/**
 * Fetch the whole List of PO for user's department
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
                dispatch({ type: types.RECEIVE_PO_VIEW, POViewList: json.data });
                resultCB('PO', json.message);
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_PO_VIEW });
                resultCB('PO', error);
            });
    }
}

/**
 * Fetch the whole List of Transfers for user's department
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
                resultCB('Transfers', json.message);
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
    let endpoint = 'api/v1/cbn/inventory/GetDetailRequest';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }


    let body = {
        "ListRequestNo": [
            {
                "RequestNo": requestNo
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
                resultCB(error);
            });
    }
}

/**
 * Forward a request form to be reviewed by another account
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
                resultCB(error);
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
                resultCB(error);
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
                resultCB(error);
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
    let endpoint = 'api/v1/cbn/inventory/GetCancelPO';

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
                resultCB(error);
            });
    }
}

/**
 * Approve a PO request
 * @param {String} PONo: ID of PO to be rejected 
 * @param {String} token: User's session token 
 * @param {String} img: Base64 encoded jpeg data of image to be uploaded 
 * @param {String} name: File name the image should be uploaded as 
 * @param {Function} resultCB: Callback to be executed once the process is done 
 */
export function approvePODetails(PONo, token, img, name, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetApprovePO';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "ListApprovePO": [
            {
                "PONumber": PONo,
                "FileName": name,
                "Images": img
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                if (json.message === 'success')
                    resultCB('Successful!', 'PO Approved Successfully');
                else
                    resultCB('Something went wrong', json.message);
            })
            .catch((error) => {
                resultCB(error, error.message);
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

/**
 * Get list of request forms ready to be confirmed (whether the item received is the same as the ones detailed in the DO form)
 * @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once fetching process is done  
 */
export function getRequestConfirmation(token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetConfirmRequest';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, null)
            .then((json) => {
                dispatch({ type: types.RECEIVE_REQUEST_CONFIRMATION, requestConfirmationList: json.data });
                resultCB(json.message);
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_REQUEST_CONFIRMATION });
                resultCB(error);
            });
    }
}

/**
 * Get DO number of request delivery to be confirmed by person receiving
 * @param {Number} requestID: requestID received from fetching request details (not request number!)
 * @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once fetching is done  
 */
export function getRequestDOnumber(requestID, token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetCheckItemRequest';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }


    let body = {
        "ListRequestId": [
            {
                "RequestId": requestID
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                if (json.message === 'success')
                    resultCB('DONo', json.dataDONo[0].DONo.split(','));
                else
                    resultCB(json.message);
            })
            .catch((error) => {
                resultCB(error);
            });
    }
}

/**
 * Get list of items of a particular DO number
 * @param {String} DONo: DO number of interest 
 * @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getRequestDODetails(DONo, token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetItemDO';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    let body = {
        "ListDONo": [
            {
                "DONo": DONo
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
                resultCB(error);
            });
    }
}

/**
 * Confirm if the delivered items match the DO form from vendor
 * @param {String} token: User's session token  
 * @param {Number} requestID: requestID received from fetching request details (not request number!)
 * @param {String} DONo: DO number of form to be confirmed 
 * @param {String} ItemPieceNo List (in the form of concat string) of item piece numbers from that particular Request's DO Number 
 * @param {String} ItemCode: List (in the form of concat string) of corresponding item code for each item piece number 
 * @param {Function} resultCB: Callback to be executed once fetching is done   
 */
export function confirmRequestDO(token, requestID, DONo, ItemPieceNo, ItemCode, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetInsertConfirmRequest';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "ListInsertConfirm": [
            {
                "RequestId": requestID,
                "DONo": DONo,
                "ItemPieceNo": ItemPieceNo,
                "ItemCode": ItemCode
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                resultCB('Successful!', 'Request Confirmation Successful');
            })
            .catch((error) => {
                resultCB(error, error.message);
            });
    }
}

/**
 * Get List of items user has requested (Request By === user's name)
 * @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once fetching process is done 
 */
export function getItemRequestBy(token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetDetailRequestBy';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, null)
            .then((json) => {
                dispatch({ type: types.RECEIVE_MYREQ_LIST, myRequestList: json.data });
                resultCB(json.message);
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_MYREQ_LIST });
                resultCB(error);
            });
    }
}

/**
 * Get list of DO Customers
* @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once fetching process is done 
 * @param {Number} options: 1 = Admin's DO list, 2 = Installer's task list 
 */
export function getListDOCustomer(token, resultCB, options) {
    let endpoint = 'api/v1/cbn/inventory/GetListDOCust';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    let body = {
        "ListValue": [
            {
                "Value": options
            }
        ]
    };

    return dispatch => {

        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                if (options === 1)
                    dispatch({ type: types.RECEIVE_DOCUST, DOCustList: json.data });
                else
                    dispatch({ type: types.RECEIVE_TASKLIST, taskList: json.data });

                resultCB(json.message, 'WAMS');
            })
            .catch((error) => {
                if (options === 1)
                    dispatch({ type: types.EMPTY_DOCUST });
                else
                    dispatch({ type: types.EMPTY_TASKLIST });

                resultCB(error, 'WAMS');
            });
    }
}

export function getTaskList(empID, resultCB) {
    let endpoint = `api.php?method=Customer_visit&staff_id=${empID}&key=xkRKJui9acBcx4CG/UAdasjajH==`;
    let url = 'http://10.64.2.54/api-mob/';

    let header = {
        "Content-Type": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header, null, url)
            .then((json) => {
                if (json.Detail !== null) {
                    dispatch({ type: types.RECEIVE_INTRA_TASKLIST, intraTaskList: Object.values(json.Detail) });
                    resultCB('success', 'Intranet');
                }
                else {
                    dispatch({ type: types.EMPTY_INTRA_TASKLIST });
                    resultCB('no record found', 'Intranet');
                }
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_TASKLIST });
                resultCB(error, 'Intranet');
            })
    }
}

/**
 * Get details of a particular DO number
 * @param {String} DONo: DO number of interest 
 * @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once fetching is done 
 */
export function getDOCustDetails(DONo, token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetCheckViewDOCustomer';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    let body = {
        "ListDONo": [
            {
                "DONo": DONo
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                let details = {};
                details['Customer'] = json.dataCustomer[0];
                details['Items'] = json.dataItem;

                dispatch({ type: types.RECEIVE_DETAILS, details });
                resultCB(json.message);
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_DETAILS });
                resultCB(error);
            });
    }
}

/**
 * Get List of Installers available to be assigned
 * @param {String} token: User's session token 
 * @param {Function} resultCB: Callback to be executed once fetching process is done 
 */
export function getInstallerList(token, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetListInstaller';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, null)
            .then((json) => {
                dispatch({ type: types.RECEIVE_INSTALLERS, installerList: json.data });
                resultCB(json.message);
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_INSTALLERS });
                resultCB(error);
            });
    }
}

/**
 * Edit the installer assigned to a DO Customer request
 * @param {String} token: User's session token 
 * @param {String} DONo: ID of DO form to be updated 
 * @param {String} installer: New intaller's ID 
 * @param {Function} resultCB: Callback to be executed once fetching process is done
 */
export function updateInstaller(token, DONo, installer, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetUpdateDOInstaller';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "ListUpdateDOInstaller": [
            {
                "DONo": DONo,
                "SetInstaller": installer
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                resultCB(json.message, 'Installer Updated', 'Installer has been updated to ');
            })
            .catch((error) => {
                resultCB(error);
            });
    }
}

/**
 * Confirm the statuses of each item installed for or returned from a particular customer
 * @param {String} token: User's session token  
 * @param {String} DONo: DO number of form to be confirmed 
 * @param {String} ItemPieceNo List (in the form of concat string) of item piece numbers from that particular Request's DO Number 
 * @param {String} ItemCode: List (in the form of concat string) of corresponding item code for each item piece number 
 * @param {Function} status: Status of the DO form
 * @param {Function} statusItem: Status of each item
 * @param {Function} resultCB: Callback to be executed once fetching is done   
 */
export function confirmDOCustomer(token, DONo, ItemPieceNo, ItemCode, status, statusItem, resultCB) {
    let endpoint = 'api/v1/cbn/inventory/GetInsertConfirmDOCustomer';

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    let body = {
        "ListInsertConfirmDOCustomer": [
            {
                "DONo": DONo,
                "ItemPieceNo": ItemPieceNo,
                "ItemCode": ItemCode,
                "status": status,
                "statusItem": statusItem
            }
        ]
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                resultCB('Successful!', 'DO Customer has been successfully confirmed');
            })
            .catch((error) => {
                resultCB(error, error.message);
            });
    }
}