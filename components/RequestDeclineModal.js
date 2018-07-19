import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { View, StyleSheet, Text, Alert, TextInput } from 'react-native';
import Modal from 'react-native-modal';

import { color, fontFamily, fontSize, windowWidth, windowHeight, normalize } from '../theme/baseTheme';

const styles = StyleSheet.create({
    dialogBox: {
        backgroundColor: color.white,
        width: 0.85 * windowWidth,
        height: 0.48 * windowHeight,
        borderRadius: normalize(2),
        alignSelf: 'center'
    },
    headerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: color.light_grey,
    },
    headerText: {
        fontSize: fontSize.large,
        fontFamily: fontFamily.medium,
        color: color.light_black
    },
    bodyContainer: {
        flex: 3,
        justifyContent: 'center',
        padding: normalize(15)
    },
    textStyle: {
        fontSize: fontSize.regular,
        fontFamily: fontFamily.medium,
        marginBottom: normalize(5),
        marginHorizontal: normalize(5)
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        borderWidth: 1,
        marginHorizontal: normalize(5)
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: color.light_grey,
        height: normalize(82),
    },
    button: {
        flex: 1,
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: fontSize.regular + 2,
        fontFamily: fontFamily.medium
    }
});

const RequestDeclineModal = (props) => {
    return (
        <Modal isVisible={props.visible} hideModalContentWhileAnimating={true} animationIn="zoomInDown" animationOut="zoomOutUp" animationInTiming={200} animationOutTiming={200} onBackButtonPress={props.close} onBackdropPress={props.close} >
            <View style={styles.dialogBox}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}> Decline Request </Text>
                </View>
                <View style={styles.bodyContainer}>
                    <Text style={[styles.textStyle, { fontFamily: fontFamily.regular }]}>Are you sure to DECLINE this transfer?</Text>
                    <Text style={styles.textStyle}>Notes:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder={"Reason for declining request... (optional)"}
                            multiline={true}
                            autoCorrect={false}
                            numberOfLines={4}
                            onChangeText={props.onChangeText}
                            value={props.value}
                            maxLength={100}
                            underlineColorAndroid={color.white}
                            style={{ marginHorizontal: normalize(10), marginVertical: normalize(5), textAlignVertical: 'top' }} />
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <Button title="Cancel"
                            textStyle={styles.buttonText}
                            backgroundColor={color.light_grey}
                            onPress={props.close}
                            borderRadius={8} />
                    </View>
                    <View style={styles.button}>
                        <Button title="Decline"
                            textStyle={styles.buttonText}
                            backgroundColor={color.red}
                            onPress={props.decline}
                            borderRadius={8} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

RequestDeclineModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onChangeText: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    decline: PropTypes.func.isRequired
}

export default RequestDeclineModal;