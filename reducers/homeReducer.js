import * as t from '../actions/actionTypes/homeTypes';

let initialState = { isRequestListReceived: false, isDetailsReceived: false, requestList: {}, requestHead: {}, requestDetails: {} };

/**
 * Updates store's state based on actionTypes
 * @param {Object} state: initial/current state of the reducer 
 * @param {Object} action: simple object containing actionType and update on states
 */
export default function homeReducer(state = initialState, action)
{
    switch (action.type) {
        case t.RECEIVE_REQUEST_LIST:
            return Object.assign({}, state, { isRequestListReceived: true, requestList: action.requestList });
        case t.RECEIVE_EMPTY_REQUEST:
            return Object.assign({}, state, { isRequestListReceived: false, requestList: {} });
        case t.SIGNED_OUT:
            return Object.assign({}, state, { isRequestListReceived: false, requestList: {} });
        case t.RECEIVE_DETAILED_VIEW: 
            return Object.assign({}, state, { isDetailsReceived: true, requestHead: action.request, requestDetails: action.details});
        case t.RECEIVE_EMPTY_DETAILS: 
            return Object.assign({}, state, { isDetailsReceived: false, requestHead: {}, requestDetails: {}});
        default:
            return state;
    }

    
}
