import * as t from '../actions/actionTypes/menuTypes';

let initialState = {
    menuReceived: false,
    menuList: {},
    currentScene: null
};

/**
 * Updates store's state based on actionTypes
 * @param {Object} state: initial/current state of the reducer 
 * @param {Object} action: simple object containing actionType and update on states
 */
export default function workspaceReducer(state = initialState, action) {
    switch (action.type) {
        case t.RECEIVE_MENU:
            return Object.assign({}, state, { menuReceived: true, menuList: action.menu }); break;
        case t.EMPTY_MENU:
            return Object.assign({}, state, { menuReceived: false, menuList: {} }); break;
        case t.UPDATE_MENU:
            return Object.assign({}, state, { currentScene: action.currentScene }); break;
        default:
            return state;
    }
}