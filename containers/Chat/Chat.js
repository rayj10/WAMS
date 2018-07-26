import React from 'react';
import {
    View,
    Text
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from '../utils/firebase';

import styles from './styles';

export default class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };

        this.user = firebase.auth().currentUser
        this.friend = this.props.friend



        this.chatRef = this.getRef().child('chat/' + this.generateChatId());
        this.chatRefData = this.chatRef.orderByChild('order')
        this.onSend = this.onSend.bind(this);

    }

    generateChatId() {
        if (this.user.uid > this.friend.uid)
            return `${this.user.uid}-${this.friend.uid}`
        else
            return `${this.friend.uid}-${this.user.uid}`
    }

    getRef() {
        return firebase.database().ref();
    }

    listenForItems(chatRef) {
        chatRef.on('value', (snap) => {

            // get children as an array
            var items = [];
            snap.forEach((child) => {
                var avatar = '../../assets/images/Avatar.png'
                var name = child.val().uid == this.user.uid ? this.user.name : this.friend.name
                items.push({
                    _id: child.val().createdAt,
                    text: child.val().text,
                    createdAt: new Date(child.val().createdAt),
                    user: {
                        _id: child.val().uid,
                        avatar: avatar
                    }
                });
            });

            this.setState({
                loading: false,
                messages: items
            })


        });
    }

    componentDidMount() {
        this.listenForItems(this.chatRefData);
    }

    componentWillUnmount() {
        this.chatRefData.off()
    }

    onSend(messages = []) {

        this.setState({
            messages: GiftedChat.append(this.state.messages, messages),
        });

        messages.forEach(message => {
            var now = new Date().getTime()
            this.chatRef.push({
                _id: now,
                text: message.text,
                createdAt: now,
                uid: this.user.uid,
                order: -1 * now
            })
        })

    }
    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={this.onSend.bind(this)}
                user={{
                    _id: this.user.uid,
                }}
            />
        );
    }
}