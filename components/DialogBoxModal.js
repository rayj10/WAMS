import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import { color, fontFamily, fontSize, windowWidth, windowHeight, normalize } from '../theme/baseTheme';

const styles = StyleSheet.create({
    dialogBox: {
        backgroundColor: color.white,
        width: 0.88 * windowWidth,
        height: 0.25 * windowHeight,
        borderRadius: normalize(4),
        alignSelf: 'center'
    },
    bodyContainer: {
        flex: 1.3,
        justifyContent: 'center',
        padding: normalize(15)
    },
    titleTextStyle: {
        fontSize: fontSize.large,
        fontFamily: fontFamily.bold,
        marginBottom: normalize(5),
    },
    textStyle: {
        fontSize: fontSize.regular,
        fontFamily: fontFamily.regular,
        marginBottom: normalize(5),
    },
    inputContainer: {
        flex: 1.5,
        marginHorizontal: normalize(5),
        justifyContent: 'center'
    },
    buttonContainer: {
        flex: 1,
        borderTopWidth: 0.5,
        borderColor: color.light_grey,
    },
    innerButtonContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.white,
        borderWidth: 0.5,
        borderColor: color.light_grey
    },
    buttonText: {
        fontSize: fontSize.regular + 2,
        fontFamily: fontFamily.medium,
        color: color.light_blue
    }
});

const DialogBoxModal = (props) => {
    let { buttons } = props;
    let h;

    if (props.height) 
        h = props.height;
    else {
        if (typeof props.content === 'string')
            h = 0.067 * props.content.split("\n").length;
        else
            h = 0.067 * props.content.length;
    }

    return (
        <Modal isVisible={props.visible} hideModalContentWhileAnimating={true} animationIn="zoomInDown" animationOut="zoomOutUp" animationInTiming={200} animationOutTiming={200} onBackButtonPress={buttons[buttons.length - 1].onPress} onBackdropPress={buttons[buttons.length - 1].onPress} >
            <View style={[styles.dialogBox, h > 0.25 ? { height: h * windowHeight } : null]}>
                <View style={styles.bodyContainer}>
                    <Text style={styles.titleTextStyle}> {props.title} </Text>
                    <View style={styles.inputContainer}>
                        <View>
                            <ScrollView showVerticalScrollIndicator={false}>
                                {props.content}
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={[styles.buttonContainer, buttons.length === 1 ? { height: normalize(45), flex: 0 } : null]}>
                    {
                        buttons.length > 1 ?
                            <View style={styles.innerButtonContainer}>
                                <TouchableOpacity onPress={buttons[0].onPress} style={{ flex: 1 }}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>{buttons[0].text}</Text>
                                    </View>
                                </TouchableOpacity>
                                {
                                    buttons.length > 2 ?
                                        <TouchableOpacity onPress={buttons[1].onPress} style={{ flex: 1 }}>
                                            <View style={styles.button}>
                                                <Text style={styles.buttonText}>{buttons[1].text}</Text>
                                            </View>
                                        </TouchableOpacity> : null
                                }
                            </View> : null
                    }
                    <TouchableOpacity onPress={buttons[buttons.length - 1].onPress} style={{ flex: 1 }}>
                        <View style={[styles.button, { borderBottomEndRadius: 4, borderBottomStartRadius: 4 }]}>
                            <Text style={styles.buttonText}>{buttons[buttons.length - 1].text}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal >
    )
}

DialogBoxModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    content: PropTypes.any.isRequired,
    buttons: PropTypes.array.isRequired
}

export default DialogBoxModal;