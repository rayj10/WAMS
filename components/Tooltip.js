import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';

import { fontFamily, fontSize, normalize } from '../theme/baseTheme';

const styles = StyleSheet.create({
    container: {
        flex: 0,
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 0,
        left: 0,
    },
    box: {
        flexDirection: 'row',
        width: normalize(100),
        height: normalize(50),
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: fontSize.small,
        fontFamily: fontFamily.regular
    },

});

const Tooltip = (props) => {
    return (
        <Modal isVisible={props.visible} style={{ justifyContent: 'flex-start', margin: 0 }} backdropColor='transparent' hideModalContentWhileAnimating={true} animationInTiming={200} animationOutTiming={200} onBackButtonPress={props.close} onBackdropPress={props.close} >
            <View style={[styles.container, { left: props.x, top: props.y }]}>
                <View style={[styles.box, props.boxStyle]}>
                    {props.icon}
                    <Text style={styles.textStyle}>{props.content}</Text>
                </View>
            </View>
        </Modal >
    )
}

Tooltip.propTypes = {
    visible: PropTypes.bool.isRequired,
    content: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired
}

export default Tooltip;