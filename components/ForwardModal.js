/**
 * Component that renders a Modal for forwarding requests
 * used by RequestDetails.js
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { View, StyleSheet, Text, ScrollView, Alert} from 'react-native';
import Modal from 'react-native-modal';

import { color, fontFamily, fontSize, windowWidth, windowHeight, normalize } from '../theme/baseTheme';

const styles = StyleSheet.create({
    dialogBox: {
        flex: 0,
        backgroundColor: color.white,
        width: 0.85 * windowWidth,
        height: 0.7 * windowHeight,
        borderRadius: 4,
        alignSelf:'center'
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
        color: color.white
    },
    bodyContainer: {
        flex: 5,
        justifyContent:'center'
    },
    textStyle: {
        fontSize: fontSize.regular,
        fontFamily: fontFamily.medium,
        marginLeft: 30,
        marginBottom: 5,
        marginTop:25
    },
    scrollContainer: {
        flex:1,
        justifyContent: 'center',
        borderWidth: 1,
        marginBottom:25,
        marginLeft: 35,
        marginRight: 35
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: 10,
        paddingBottom: 10,
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

const ForwardModal = (props) => {
    return (
        <Modal isVisible={props.visible} hideModalContentWhileAnimating={true} animationIn="zoomInDown" animationOut="zoomOutUp" animationInTiming={200} animationOutTiming={200} onBackButtonPress ={props.close} onBackdropPress ={props.close}>
                <View style={styles.dialogBox}>
                    <View style={styles.headerContainer}>
                        <Text style={[styles.headerText, { color: color.light_black }]}> Forward To </Text>
                    </View>
                    <View style={styles.bodyContainer}>
                        <Text style={styles.textStyle}> Select Forward Account </Text>
                        <View style={styles.scrollContainer}>
                            <ScrollView>
                                {props.forwardList()}
                            </ScrollView>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            <Button title="Close"
                                textStyle={styles.buttonText}
                                backgroundColor={color.light_grey}
                                onPress={props.close}
                                borderRadius={8} />
                        </View>
                        <View style={styles.button}>
                            <Button title="Forward"
                                textStyle={styles.buttonText}
                                backgroundColor={color.light_blue}
                                onPress={props.forward}
                                borderRadius={8} />
                        </View>
                    </View>
                </View>
        </Modal>  
    )
}

ForwardModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    forwardList: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    forward: PropTypes.func.isRequired
}

export default ForwardModal;