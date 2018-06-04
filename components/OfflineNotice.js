import React from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet } from 'react-native';

import { windowWidth, normalize } from '../theme/baseTheme'

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#b52424',
        height: normalize(30),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: windowWidth,
        position: 'absolute',
        top: normalize(30)
    },
    offlineText: {
        color: '#fff'
    }
});

function MiniOfflineSign() {
    return (
        <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
    );
}

class OfflineNotice extends React.Component {
    constructor() {
        super();
        this.state = {
            isConnected: true
        }
    }

    handleConnectivityChange = (isConnected) => {
        if (isConnected) {
            this.setState({ isConnected: true });
        } else {
            this.setState({ isConnected: false });
        }
    };

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    render() {
        if (!this.state.isConnected) {
            return <MiniOfflineSign />;
        }
        return null;
    }
}

export default OfflineNotice;