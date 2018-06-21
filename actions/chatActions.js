import firebase from '../firebase';
import DeviceInfo from 'react-native-device-info';
import { Alert } from 'react-native';

export function login(username, password) {
    firebase.auth()
        .signInWithEmailAndPassword(username, password)
        .catch((error) => {
            Alert.alert(error, error.message);
        });
}

export function signup(username, password) {
    firebase.auth()
        .createUserWithEmailAndPassword(username, password)
        .catch((error) => {
            Alert.alert(error, error.message);
        });
}