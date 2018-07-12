/*
  Creates a Form component that accepts an array of fields and
  creates the TextInput for each field, renders a button and also
  in charge of validating the data and extracting the data to be
  passed to the API
*/

import React from 'react';
import PropTypes from 'prop-types'
import { Text, View, Image, KeyboardAvoidingView, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';

import { isEmpty, validate } from '../utils/validate'
import AuthTextInput from './AuthTextInput'
import { color, padding, windowWidth, normalize, fontSize, fontFamily, windowHeight } from '../theme/baseTheme';
import { Logo } from '../assets/images';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white
    },

    activityIndicatorContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },

    image: {
        height: normalize(160),
        width: windowWidth - 35,
        marginBottom: normalize(15),
        resizeMode: 'contain'
    },

    wrapper: {
        marginVertical:windowHeight/10,
        justifyContent: "center",
        alignItems: "center"
    },

    errorText: {
        color: color.red,
        width: windowWidth - 45,
        marginTop: normalize(20)
    },

    containerView: {
        marginVertical: 24,
        width: windowWidth - 40
    },

    button: {
        backgroundColor: color.blue,
        height: normalize(55)
    },

    buttonText: {
        fontSize: fontSize.regular + 2,
        fontFamily: fontFamily.medium
    },

    forgotText: {
        textAlign: "center",
        color: color.black,
        fontSize: fontSize.regular + 2,
        fontFamily: fontFamily.bold,
    }
});

class loginForm extends React.Component {
    constructor(props) {
        super(props);

        const { fields, error } = props;

        this.state = this.createState(fields, error);

        //bind functions
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * Iterate the fields and create state based on that
     * @param {Object} fields: Input from textboxes
     * @param {Object} error: Error messages 
     */
    createState(fields, error) {
        const state = {};
        fields.forEach((field) => {
            let { key, type, value } = field;
            state[key] = { type: type, value: value };
        })

        state["error"] = error;
        state["submitted"] = false;

        return state;
    }

    /**
     * Validates input fields and determine whether to show error or log user in
     */
    onSubmit() {
        this.setState({ submitted: true }); //shows activity indicator

        const data = this.state;
        const result = validate(data);
        if (!result.success) {
            this.setState({ error: result.error });
            setTimeout(() => {
                this.setState({ submitted: false }) //terminate activity indicator
            }, 500);
        }
        else
            this.props.onSubmit(this.extractData(data), () => this.setState({ submitted: false }));
    }

    /**
     * Extract validated data from textboxes form it into Object of login credentials
     * @param {Object} data: Textbox input 
     */
    extractData(data) {
        const retData = {};

        Object.keys(data).forEach(function (key) {
            if (key !== "error" && key !== "submitted") {
                let { value } = data[key];
                retData[key] = value;
            }
        });

        return retData;
    }

    /**
     * Update textbox input display using state
     * @param {String} key: Textbox name 
     * @param {String} text: Textbox content 
     */
    onChange(key, text) {
        const state = this.state;
        state[key]['value'] = text;
        this.setState(state);
    }

    render() {
        const { fields, showLabel, buttonTitle, onForgotPassword } = this.props;

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.wrapper}>
                    <Image style={styles.image} source={Logo} />
                    {
                        (!isEmpty(this.state.error['general'])) &&
                        <Text style={styles.errorText}>{this.state.error['general']}</Text>
                    }
                    {
                        fields.map((data, idx) => {
                            let { key, label, placeholder, autoFocus, secureTextEntry } = data;
                            return (
                                <AuthTextInput key={key}
                                    label={label}
                                    showLabel={showLabel}
                                    placeholder={placeholder}
                                    autoFocus={autoFocus}
                                    onChangeText={(text) => this.onChange(key, text)}
                                    secureTextEntry={secureTextEntry}
                                    value={this.state[key]['value']}
                                    error={this.state.error[key]} />
                            )
                        })
                    }
                    {
                        this.state.submitted ?
                            <View style={styles.activityIndicatorContainer}>
                                <ActivityIndicator animating={this.state.isSubmitted} size='large' />
                            </View>
                            :
                            <Button
                                raised
                                title={buttonTitle}
                                borderRadius={4}
                                containerViewStyle={styles.containerView}
                                buttonStyle={styles.button}
                                textStyle={styles.buttonText}
                                onPress={this.onSubmit} />
                    }

                    {
                        this.props.onForgotPassword !== null &&
                        <Text style={styles.forgotText} onPress={onForgotPassword}>
                            Need Help?</Text>
                    }

                </View>
            </KeyboardAvoidingView>
        );
    }
}

loginForm.propTypes = {
    fields: PropTypes.array,
    showLabel: PropTypes.bool,
    buttonTitle: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.object
}


loginForm.defaultProps = {
    onForgotPassword: null,
}


export default loginForm;
