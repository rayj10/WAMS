import * as t from '../actions/actionTypes/workspaceTypes';

let initialState = {
    requestApprovalReceived: false,
    requestViewReceived: false,
    requestConfirmationReceived: false,

    POApprovalReceived: false,
    POViewReceived: false,

    transferApprovalReceived: false,
    transferViewReceived: false,

    detailsReceived: false,
    forwardListReceived: false,
    myRequestListReceived: false,
    DOCustListReceived: false,
    taskListReceived: false,
    installerListReceived: false,

    requestApprovalList: {},
    requestViewList: {},
    requestConfirmationList: {},

    POApprovalList: {},
    POViewList: {},

    transferApprovalList: {},
    transferViewList: {},

    details: {},
    forwardList: {},
    myRequestList: {},
    DOCustList: {},
    taskList: {},
    installerList: {}
};

/**
 * Updates store's state based on actionTypes
 * @param {Object} state: initial/current state of the reducer 
 * @param {Object} action: simple object containing actionType and update on states
 */
export default function workspaceReducer(state = initialState, action) {
    switch (action.type) {
        case t.RECEIVE_REQUEST_APPROVAL:
            return Object.assign({}, state, { requestApprovalReceived: true, requestApprovalList: action.requestApprovalList }); break;
        case t.EMPTY_REQUEST_APPROVAL:
            return Object.assign({}, state, { requestApprovalReceived: false, requestApprovalList: {} }); break;
        case t.RECEIVE_REQUEST_VIEW:
            return Object.assign({}, state, { requestViewReceived: true, requestViewList: action.requestViewList }); break;
        case t.EMPTY_REQUEST_VIEW:
            return Object.assign({}, state, { requestViewReceived: false, requestViewList: {} }); break;
        case t.RECEIVE_REQUEST_CONFIRMATION:
            return Object.assign({}, state, { requestConfirmationReceived: true, requestConfirmationList: action.requestConfirmationList }); break;
        case t.EMPTY_REQUEST_CONFIRMATION:
            return Object.assign({}, state, { requestConfirmationReceived: false, requestConfirmationList: {} }); break;

        case t.RECEIVE_PO_APPROVAL:
            return Object.assign({}, state, { POApprovalReceived: true, POApprovalList: action.POApprovalList }); break;
        case t.EMPTY_PO_APPROVAL:
            return Object.assign({}, state, { POApprovalReceived: false, POApprovalList: {} }); break;
        case t.RECEIVE_PO_VIEW:
            return Object.assign({}, state, { POViewReceived: true, POViewList: action.POViewList }); break;
        case t.EMPTY_PO_VIEW:
            return Object.assign({}, state, { POViewReceived: false, POViewList: {} }); break;

        case t.RECEIVE_TRANSFER_APPROVAL:
            return Object.assign({}, state, { transferApprovalReceived: true, transferApprovalList: action.transferApprovalList }); break;
        case t.EMPTY_TRANSFER_APPROVAL:
            return Object.assign({}, state, { transferApprovalReceived: false, transferApprovalList: {} }); break;
        case t.RECEIVE_TRANSFER_VIEW:
            return Object.assign({}, state, { transferViewReceived: true, transferViewList: action.transferViewList }); break;
        case t.EMPTY_TRANSFER_VIEW:
            return Object.assign({}, state, { transferViewReceived: false, transferViewList: {} }); break;

        case t.RECEIVE_DOCUST:
            return Object.assign({}, state, { DOCustListReceived: true, DOCustList: action.DOCustList }); break;
        case t.EMPTY_DOCUST:
            return Object.assign({}, state, { DOCustListReceived: false, DOCustList: {} }); break;
        case t.RECEIVE_TASKLIST:
            return Object.assign({}, state, { taskListReceived: true, taskList: action.taskList }); break;
        case t.EMPTY_TASKLIST:
            return Object.assign({}, state, { taskListReceived: false, taskList: {} }); break;
        case t.RECEIVE_INSTALLERS:
            return Object.assign({}, state, { installerListReceived: true, installerList: action.installerList }); break;
        case t.EMPTY_INSTALLERS:
            return Object.assign({}, state, { installerListReceived: false, installerList: {} }); break;

        case t.RECEIVE_FORWARD_LIST:
            return Object.assign({}, state, { forwardListReceived: true, forwardList: action.forwardList }); break;
        case t.EMPTY_FORWARD_LIST:
            return Object.assign({}, state, { forwardListReceived: false, forwardList: {} }); break;

        case t.RECEIVE_DETAILS:
            return Object.assign({}, state, { detailsReceived: true, details: action.details }); break;
        case t.EMPTY_DETAILS:
            return Object.assign({}, state, { detailsReceived: false, details: {} }); break;

        case t.RECEIVE_MYREQ_LIST:
            return Object.assign({}, state, { myRequestListReceived: true, myRequestList: action.myRequestList }); break;
        case t.EMPTY_MYREQ_LIST:
            return Object.assign({}, state, { myRequestListReceived: false, myRequestList: {} }); break;

        case t.SIGNED_OUT:
            return Object.assign({}, state, initialState); break;
        default:
            return state;
    }


}
