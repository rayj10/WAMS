import * as t from '../actions/actionTypes/workspaceTypes';

let initialState = {
    requestApprovalReceived: false,
    requestViewReceived: false,
    POApprovalReceived: false,
    transferApprovalReceived: false,
    transferViewReceived: false,
    detailsReceived: false,
    forwardListReceived: false,
    requestApprovalList: {},
    requestViewList: {},
    POApprovalList: {},
    transferApprovalList: {},
    transferViewList: {},
    details: {},
    forwardList: {}
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

        case t.RECEIVE_PO_APPROVAL:
            return Object.assign({}, state, { POApprovalReceived: true, POApprovalList: action.POApprovalList }); break;
        case t.EMPTY_PO_APPROVAL:
            return Object.assign({}, state, { POApprovalReceived: false, POApprovalList: {} }); break;

        case t.RECEIVE_TRANSFER_APPROVAL:
            return Object.assign({}, state, { transferApprovalReceived: true, transferApprovalList: action.transferApprovalList }); break;
        case t.EMPTY_TRANSFER_APPROVAL:
            return Object.assign({}, state, { transferApprovalReceived: false, transferApprovalList: {} }); break;
        case t.RECEIVE_TRANSFER_VIEW:
            return Object.assign({}, state, { transferViewReceived: true, transferViewList: action.transferViewList }); break;
        case t.EMPTY_TRANSFER_VIEW:
            return Object.assign({}, state, { transferViewReceived: false, transferViewList: {} }); break;

        case t.RECEIVE_FORWARD_LIST:
            return Object.assign({}, state, { forwardListReceived: true, forwardList: action.forwardList }); break;
        case t.EMPTY_FORWARD_LIST:
            return Object.assign({}, state, { forwardListReceived: false, forwardList: {} }); break;

        case t.RECEIVE_DETAILS:
            return Object.assign({}, state, { detailsReceived: true, details: action.details }); break;
        case t.EMPTY_DETAILS:
            return Object.assign({}, state, { detailsReceived: false, details: {} }); break;
        case t.SIGNED_OUT:
            return Object.assign({}, state, initialState); break;
        default:
            return state;
    }


}
