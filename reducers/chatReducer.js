import * as t from '../actions/actionTypes/chatTypes';

const initialState = {
    name: null,
    avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_3_400x400.png',
    authorizing: false,
    authorized: false,
    isFetching: false,
    lastFetched: null,
    height: 0
}

/**
 * Updates store's state based on actionTypes
 * @param {Object} state: initial/current state of the reducer 
 * @param {Object} action: simple object containing actionType and update on states
 */
export default function chatReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USER_NAME':
            return Object.assign({}, state, { name: action.name });
        case 'SET_USER_AVATAR':
            return Object.assign({}, state, { avatar: action.avatar });
        case 'USER_START_AUTHORIZING':
            return Object.assign({}, state, { authorizing: true });
        case 'USER_AUTHORIZED':
            return Object.assign({}, state, { authorizing: false, authorized: true });
        case 'START_FETCHING_MESSAGES':
            return Object.assign({}, state, { isFetching: true });
        case 'RECEIVED_MESSAGES':
            return Object.assign({}, state, { isFetching: false, lastFetched: action.receivedAt });
        case 'UPDATE_MESSAGES_HEIGHT':
            return Object.assign({}, state, { height: action.height });

        case 'ADD_MESSAGE':
            if (state.map(m => m.id).includes(action.id)) {
                return state;
            } else {
                return [
                    ...state,
                    message(undefined, action)
                ]
            }
        case 'SEND_MESSAGE':
            return [
                ...state,
                message(undefined, action)
            ]
        default:
            return state
    }
}
