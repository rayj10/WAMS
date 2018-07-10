import React from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Linking, View, Keyboard, ActivityIndicator } from 'react-native';
import { bindActionCreators } from 'redux';

import * as authAction from '../../actions/authActions';
import * as menuAction from '../../actions/menuActions';
import * as workspaceAction from '../../actions/workspaceActions';
import LoginForm from '../../components/loginForm'
import OfflineNotice from '../../components/OfflineNotice';
import Tooltip from '../../components/Tooltip';
import styles from './styles';
import { windowWidth, windowHeight, color } from '../../theme/baseTheme'

//Maps store's reducer states to Login's props 
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    isLoggedIn: state.authReducer.isLoggedIn
});

//Maps actions from authActions to Login's props
export const mapDispatchToProps = (dispatch) => ({
    actionsAuth: bindActionCreators(authAction, dispatch),
    actionsMenu: bindActionCreators(menuAction, dispatch),
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch)
});

//initialize values to be passed as props to Form
const fields = [
    {
        key: 'username',
        label: "Username",
        placeholder: "Username",
        autoFocus: false,
        secureTextEntry: false,
        value: "",
        type: "username"
    },
    {
        key: 'password',
        label: "Password",
        placeholder: "Password",
        autoFocus: false,
        secureTextEntry: true,
        value: "",
        type: "password"
    }
];
const error = {
    general: "",
    username: "",
    password: ""
}

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: error,
            tooltip: false
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onFinish = this.onFinish.bind(this);
        this.onForgotPassword = this.onForgotPassword.bind(this);
    }

    /**
     * Link to website to handle case of forgotten password
     */
    onForgotPassword() {
        this.setState({ tooltip: true });
    }

    /**
     * When Login button pressed, call actions.login, move to Main stack on success
     * @param {Object} data: inputs from Form's fields
     */
    onSubmit(data, callback) {
        this.setState({ error: error }); //clear out error messages
        Keyboard.dismiss(); //close keyboard
        this.props.actionsAuth.login(data, (token) => this.onFinish(token, callback));
    }

    /**
     * Callback to be excuted once the login process is done
     * @param {String} token: User's session token 
     * @param {Function} callback: Callback to update login form's state 
     */
    onFinish(token, callback) {
        if (token) {
            this.props.actionsMenu.getAvailableMenu(token, (error) => {
                if (error === 'Authentication Denied' && this.props.token) {
                    Alert.alert(error, 'Your session may have expired please re-enter your login credentials')
                    this.props.actionsAuth.signOut(this.props.actionsWorkspace.successSignOut.bind(this));
                    Actions.reset("Auth");
                }
            });
            Actions.Main();
        }
        callback();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Tooltip
                    visible={this.state.tooltip}
                    content={"Login using your Blackpine account.\nPlease contact ESS to reset password."}
                    boxStyle={{
                        width: 0.8 * windowWidth, height: 50, borderRadius: 8, backgroundColor: "rgba(192,192,192,0.3)",
                        borderWidth: 1, padding: 10, borderColor: color.light_grey
                    }}
                    x={0.1 * windowWidth} y={0.87 * windowHeight}
                    close={() => this.setState({ tooltip: false })} />
                <LoginForm fields={fields}
                    showLabel={false}
                    onSubmit={this.onSubmit}
                    buttonTitle={"LOG IN"}
                    error={this.state.error}
                    onForgotPassword={this.onForgotPassword} />
                <OfflineNotice />
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
