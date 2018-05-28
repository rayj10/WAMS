import * as t from '../actions/actionTypes/authTypes';

let initialState = { isLoggedIn: false, token: null, userName: null };

/**
 * Updates store's state based on actionTypes
 * @param {Object} state: initial/current state of the reducer 
 * @param {Object} action: simple object containing actionType and update on states
 */
export default function authReducer(state = initialState, action)
{
    switch (action.type) {
        case t.LOGGED_IN:{
            return Object.assign({}, state, { isLoggedIn: true, token: action.token, userName: action.userName });
        }
        case t.LOGGED_OUT:{
            return Object.assign({}, state, {isLoggedIn: false, token: null, userName: null});
        }
        default:
            return state;
    }
}
