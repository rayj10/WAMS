import { AsyncStorage, Alert } from 'react-native';
import firebase from '../utils/firebase';
var stringify = require('qs-stringify');

import * as t from './actionTypes/authTypes';
import { fetchAPI } from '../utils/fetch';
import errors from '../json/errors.json';

/**
 * Fetch token to API based on user's login credentials, 
 * then dispatch the information to redux store.
 * @param {Object} user: User's login credentials 
 * @param {Function} finishCB: Callback to be executed once the fetching process is done
 */
export function login(user, finishCB) {

    var endpoint = "oauth/token";
    const { username, password } = user;

    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic dGVzdHdhbXMwMTp0ZXN0cGFzcw=="
    };

    let body = {
        "grant_type": "password",
        "username": username,
        "password": password
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, stringify(body))
            .then((json) => {
                AsyncStorage.setItem('token', json['access_token']);
                dispatch({ type: t.LOGGED_IN, token: json['access_token'] });
                finishCB(json['access_token'], password);
            })
            .catch((error) => {
                if (errors[error] === undefined)
                    Alert.alert(errors['Unknown Error'].name, errors['Unknown Error'].message);
                else if (errors[error].login !== undefined)
                    Alert.alert(errors[error].login[0], errors[error].login[1]);
                else
                    Alert.alert(errors[error].name, errors[error].message);
                finishCB(null);
            })
    }
}

/**
 * Get the complete user profile based on session token
 * @param {String} token: User's session token 
 * @param {String} password: User's password to be used for firebase login on parallel (for chat feature)
 * @param {Function} resultCB: callback to be executed once the fetching process is done 
 */
export function getUserProfile(token, password, resultCB) {
    var endpoint = "api/v1/user/profile";

    let header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header, null)
            .then((json) => {
                //firebase auth for Chat feature
                if (password) {
                    var email = json.data[0]['Email'];
                    firebase.auth()
                        .signInWithEmailAndPassword(email, password)
                        .catch((error) => {
                            //if sign in fails because it's new user, sign the user up straightaway
                            if (error.code === 'auth/user-not-found') {
                                firebase.auth()
                                    .createUserWithEmailAndPassword(email, password)
                                    .catch((error) => {
                                        console.log(error, error.message);
                                    });
                            }
                            else {
                                console.log(error, error.message);
                            }
                        });
                }

                dispatch({ type: t.RECEIVE_USER_DETAILS, userDetails: json.data[0] });
                resultCB(json.message)
            })
            .catch((error) => {
                dispatch({ type: t.EMPTY_USER_DETAILS });
                resultCB(error)
            })
    }
}

export function getIntranetDetails(empID, resultCB) {
    var endpoint = `api.php?method=DetailStaff&staff_id=${empID}&key=xkRKJui9acBcx4CG/HCeboyIDF==`;
    let url = 'http://10.64.2.54/api-mob/';

    let header = {
        "Content-Type": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header, null, url)
            .then((json) => {
                resultCB(json.Detail);
            })
            .catch((error) => {
                console.log(error);
            })
    }
}

/**
 * Signs out user, clean up AsyncStorage containing user credentials,
 * tell redux store about the logout, execute callback
 * @param {Function} successCB: Callback to be executed once user has been logged out successfully
 */
export function signOut(successCB) {
    return (dispatch) => {
        AsyncStorage.removeItem('token');
        firebase.auth().signOut();
        dispatch({ type: t.LOGGED_OUT });
        successCB();
    }
}