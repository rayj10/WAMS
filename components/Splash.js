import React from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';

import { color, fontFamily, padding, fontSize, windowWidth, windowHeight, normalize } from "../theme/baseTheme";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white
    },

    image: {
        height: normalize(150),
        width: windowWidth - 20,
        resizeMode: 'contain'
    },

    activityIndicatorContainer: {
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems: 'center',
        bottom: 60
    }
});

export default class extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('../assets/images/logo.png')} />
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true} size='large' />
                </View>
            </View>
        );
    }
}
