import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBF7JxCK6SU9hPnVoKlxf6rRRr5QvvpR9U",
    authDomain: "wams-c86a9.firebaseapp.com",
    databaseURL: "https://wams-c86a9.firebaseio.com",
    projectId: "wams-c86a9",
    storageBucket: "",
    messagingSenderId: "762828254053"
};
firebase.initializeApp(config);

export default firebase;