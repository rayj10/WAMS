import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';

import { isEmpty } from '../utils/validate';
import { windowWidth, fontSize, fontFamily, normalize, color } from '../theme/baseTheme';
import IconWrapper from './IconWrapper';

const styles = StyleSheet.create({
    container: {
        marginBottom: 10
    },

    inputContainer: {
        width: windowWidth - 40,
        height: normalize(65),
        fontSize: fontSize.regular + 2,
        fontFamily: fontFamily.bold,
        borderBottomColor: "#A5A7A9",
        alignSelf: 'center'
    }
});

class AuthTextInput extends Component {
    state = {
        secureText: this.props.secureTextEntry
    }

    render() {
        const { showLabel, placeholder, autoFocus, onChangeText } = this.props;

        return (
            <View style={styles.container}>
                {
                    (showLabel) &&
                    <FormLabel>{this.props.label}</FormLabel>
                }
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <FormInput
                        autoCapitalize='none'
                        clearButtonMode='while-editing'
                        underlineColorAndroid={"#fff"}
                        placeholder={placeholder}
                        autoFocus={autoFocus}
                        onChangeText={onChangeText}
                        secureTextEntry={this.state.secureText}
                        inputStyle={[styles.inputContainer, this.props.secureTextEntry ? { width: windowWidth - 90, alignSelf: 'flex-start' } : null]}
                        value={this.props.value} />
                    {
                        this.props.secureTextEntry ?
                            this.state.secureText ?
                                <IconWrapper name="visibility" size={20} color={color.light_grey} style={{ justifyContent: 'center', paddingHorizontal: 5 }} onPress={() => this.setState({ secureText: false })} />
                                :
                                <IconWrapper name="visibility-off" size={20} color={color.light_grey} style={{ justifyContent: 'center', paddingHorizontal: 5 }} onPress={() => this.setState({ secureText: true })} />
                            :
                            null
                    }
                </View>
                {
                    (!isEmpty(this.props.error)) &&
                    <FormValidationMessage>
                        {this.props.error}
                    </FormValidationMessage>
                }
            </View>
        );
    }
}

AuthTextInput.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    placeholder: PropTypes.string,
    autoFocus: PropTypes.bool,
    onChangeText: PropTypes.func.isRequired,
    secureTextEntry: PropTypes.bool,
    value: PropTypes.string,
    error: PropTypes.string,
}

AuthTextInput.defaultProps = {
    autoFocus: false,
    secureTextEntry: false
}

export default AuthTextInput;
