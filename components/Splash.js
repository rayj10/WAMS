import React from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';

import { color, windowWidth, normalize } from "../theme/baseTheme";
import { Logo } from '../assets/images';

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
                <Image style={styles.image} source={Logo} />
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator animating={true} size='large' />
                </View>
            </View>
        );
    }
}
