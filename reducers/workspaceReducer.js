import * as t from '../actions/actionTypes/workspaceTypes';

let initialState = {
    requestApprovalReceived: false,
    requestViewReceived: false,
    detailsReceived: false,
    requestApprovalList: {},
    requestViewList: {},
    requestDetails: {}
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
        case t.EMPTY_APPROVAL_LIST:
            return Object.assign({}, state, { requestApprovalReceived: false, requestApprovalList: {} }); break;
        case t.RECEIVE_REQUEST_VIEW:
            return Object.assign({}, state, { requestViewReceived: true, requestViewList: action.requestViewList }); break;
        case t.EMPTY_VIEW_LIST:
            return Object.assign({}, state, { requestViewReceived: false, requestViewList: {} }); break;
        case t.RECEIVE_DETAILS:
            return Object.assign({}, state, { detailsReceived: true, requestDetails: action.details }); break;
        case t.EMPTY_DETAILS:
            return Object.assign({}, state, { detailsReceived: false, requestDetails: {} }); break;
        case t.SIGNED_OUT:
            return Object.assign({}, state, initialState); break;
        default:
            return state;
    }


}
