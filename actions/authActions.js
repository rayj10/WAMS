import { AsyncStorage, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';

import * as t from './actionTypes/authTypes';
import { fetchAPI } from '../utils/fetch';

/**
 * Fetch token to API based on user login credentials, 
 * then dispatch the information to redux store.
 * @param {Object} user: User's login credentials 
 * @param {Function} successCB: callback - what to do when login successful 
 */
export function login(user, successCB) {

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
        return fetchAPI(endpoint, 'POST', header, body)
            .then((json) => {
                AsyncStorage.setItem('token', json['access_token']);
                AsyncStorage.setItem('username', username);
                dispatch({ type: t.LOGGED_IN, token: json['access_token'], userName: username });
                successCB();
            })
            .catch((error) => {
                if (error === 'Bad request')
                    Alert.alert('Invalid Login', 'Username and Password did not match');
                else
                    Alert.alert(error, 'Please check your connection or try again later');
            })
    }
}

/**
 * Signs out user, clean up AsyncStorage containing user credentials,
 * tell redux store about the logout, execute callback
 * @param {Function} successCB: callback - what to do when logout is done 
 */
export function signOut(successCB) {
    return (dispatch) => {
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('username');
        dispatch({ type: t.LOGGED_OUT });
        successCB();
    }
}