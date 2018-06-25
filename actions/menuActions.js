import * as types from './actionTypes/menuTypes';
import { fetchAPI } from '../utils/fetch';

export function updateMenu(currentScene){
    return dispatch => {
        dispatch({ type: types.UPDATE_MENU, currentScene });
    }
}

export function getAvailableMenu(token, errorCB){
    let endpoint = '/api/v1/user/menu';

    let header = {
        "Authorization": "Bearer " + token,
        "Cache-Control": "no-cache",
    }

    return dispatch => {

        return fetchAPI(endpoint, 'GET', header, null)
            .then((json) => {
                dispatch({ type: types.RECEIVE_MENU, menu: json.data });
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_MENU });
                errorCB(error)
            });
    }
}