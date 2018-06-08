import React from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet, StatusBar } from 'react-native';

import { windowWidth, normalize, color } from '../theme/baseTheme'

const styles = StyleSheet.create({
    offlineContainer: {
        position: 'absolute',
        top: 0,
        backgroundColor: color.red,
        height: normalize(30),
        width: windowWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    offlineText: {
        color: color.white
    }
});

class OfflineNotice extends React.Component {
    constructor() {
        super();
        this.state = {
            isConnected: true
        }
    }

    /**
     * Render an offline sign on top of the screen
     */
    miniOfflineSign() {
        return (
            <View style={styles.offlineContainer}>
                <Text style={styles.offlineText}>No Internet Connection</Text>
                <StatusBar hidden={true} />
            </View>
        );
    }

    /**
     * Callback to be called when there's a connection change
     */
    handleConnectivityChange = (isConnected) => {
        this.setState({ isConnected });
    };

    componentDidMount() {
        NetInfo.isConnected.fetch().then(isConnected => this.setState({ isConnected }));
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    render() {
        if (!this.state.isConnected) {
            return this.miniOfflineSign();
        }
        return null;
    }
}

export default OfflineNotice;