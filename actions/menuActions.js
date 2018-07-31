import * as types from './actionTypes/menuTypes';
import { fetchAPI } from '../utils/fetch';
import menuInfo from '../json/menuInfo.json';

/**
 * Keeps track of current scene to be used by backhandler
 * @param {String} currentScene: Current active scene on the stack 
 */
export function updateMenu(currentScene) {
    return dispatch => {
        dispatch({ type: types.UPDATE_MENU, currentScene });
    }
}

/**
 * Fetch available menu for the current user based on the supplied token
 * @param {String} token User's session token
 * @param {Function} errorCB: Callback in case fetch failed
 */
export function getAvailableMenu(token, errorCB) {
    let endpoint = 'api/v1/user/menu';

    let header = {
        "Authorization": "Bearer " + token,
        "Cache-Control": "no-cache",
    }

    return dispatch => {

        return fetchAPI(endpoint, 'GET', header, null)
            .then((json) => {
                let menu = [];
                //find level 1 menu
                json.data.map((item) => {
                    if (item['ParentMenuID'] === menuInfo.Constants.ROOT) {
                        //find the children of currently iterated menu in the list
                        let children = []
                        json.data.map((subitem) => {
                            if (subitem['ParentMenuID'] === item['MenuID'])
                                children.push(subitem['MenuID']);
                        });
                        menu.push({ 'MenuID': item['MenuID'], 'Children': children });
                    }
                });

                //sort level 1 menu based on number of children
                menu.sort((a, b) => { return b['Children'].length - a['Children'].length });

                dispatch({ type: types.RECEIVE_MENU, menu: menu });
            })
            .catch((error) => {
                dispatch({ type: types.EMPTY_MENU });
                errorCB(error)
            });
    }
}