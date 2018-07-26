import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ListView,
    ActivityIndicator,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import firebase from '../utils/firebase';

import styles from './styles';
import { img } from '../../assets/images';

export default class FriendsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loading: true
        };
        this.friendsRef = this.getRef().child('friends');
    }

    getRef() {
        return firebase.database().ref();
    }

    listenForItems(friendsRef) {
        var user = firebase.auth().currentUser;

        friendsRef.on('value', (snap) => {

            // get children as an array
            var items = [];
            snap.forEach((child) => {
                if (child.val().email != user.email)
                    items.push({
                        name: child.val().name,
                        uid: child.val().uid,
                        email: child.val().email
                    });
            });

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(items),
                loading: false
            });

        });
    }

    componentDidMount() {
        this.listenForItems(this.friendsRef);
    }

    renderRow = (rowData) => {
        return <TouchableOpacity onPress={() => Actions.Chat({ friend: rowData })}>
            <View style={styles.profileContainer}>
                <Image source={img.app.Avatar} style={styles.profileImage} />
                <Text style={styles.profileName}>{rowData.name}</Text>
            </View>
        </TouchableOpacity>
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topGroup}>
                    <Text style={styles.myFriends}>Staff</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow} />
                <ActivityIndicator animating={this.state.loading} size='large' />
            </View>
        );
    }
}