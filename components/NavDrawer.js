import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView, Alert, Image, BackHandler,
    Platform
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as authAction from '../actions/authActions';
import * as homeAction from '../actions/homeActions';
import { color, fontFamily, fontSize } from '../theme/baseTheme';

//Maps reducer's state to NavDrawer's props
export const mapStateToProps = state => ({
    username: state.authReducer.userName
});

//Maps actions to NavDrawer's props
export const mapDispatchToProps = (dispatch) => ({
    actionsHome: bindActionCreators(homeAction, dispatch),
    actionsAuth: bindActionCreators(authAction, dispatch)
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        height: 215,
        paddingTop: 30,
        backgroundColor: '#f2f7fc',
        alignItems: 'center'
    },
    avatar: {
        height: 140,
        width: 140,
        borderRadius: 70
    },
    headerText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.large
    },
    itemContainer: {
        marginTop: 1
    },
    icon: {
        paddingRight: 10
    },
    navItem: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    navText: {
        fontFamily: fontFamily.bold,
        fontSize: 16,
    },
    activeItem: {
        backgroundColor: 'rgba(187,189,192,0.7)', //color.light_grey with opacity adjusted
        borderRightWidth: 4,
        borderColor: color.blue
    },
    button: {
        marginTop: 15,
        backgroundColor: color.blue,
        borderRadius: 4
    }
});

class NavDrawer extends React.Component {
    constructor(props) {
        super(props);
        
        let name = this.props.username;
        
        this.state = {
            currentTab: "Home",                                          //marks which drawer item to highlight based on active scene
            userName: name.charAt(0).toUpperCase() + name.slice(1)       //user's name to be displayed on avatar
        }

        this.goto = this.goto.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.username !== nextProps.username)     //do not remount when only name received
            return false
        return true
    }

    /**
     * Callback to be called when Android hardware back button pressed
     */
    handleBackButton() {
        if (Actions.currentScene === '_Approval')
            this.onSignOut()
        else if (this.state.currentTab !== 'Home')  //in another tab
            this.goto('Home');
        else if (Actions.currentScene === 'Login')
            BackHandler.exitApp();
        else                                        //in home tab, siblings of Approval scene
            Actions.pop();
        return true;
    }

    componentDidMount() {
        if (Platform.OS === 'android')
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        if (Platform.OS === 'android')
            BackHandler.removeEventListener('hardwareBackPress');
    }

    componentDidUpdate() {
        /*workaround because of problems with listeners not stacking as expected, new listener is pushed onto
        listener stack when autologin is done, Actions.pop() used instead of the defined BackHandler, hence, we
        have to set state manually in case of mismatch*/
        if (this.state.currentTab !== 'Home' && Actions.currentScene === '_Approval')
            this.setState({ currentTab: 'Home' })
    }

    /**
     * Success case callback function
     * Call home's successSignOut() in actions.js to reset home reducer's state
     * and go back to login screen
     */
    onSuccess() {
        this.props.actionsHome.successSignOut();
        Actions.reset("Auth");
    }

    onError(error) {
        Alert.alert('Oops!', error.message);
    }

    /**
     * When user clicks Logout button from Drawer
     * use signOut() from auth's actions.js 
     */
    onSignOut() {
        this.props.actionsAuth.signOut(this.onSuccess.bind(this), this.onError.bind(this))
    }

    /**
     * Determine the next scene to be displayed utilizing RNRF's Actions
        @param {String} route: Name of screen to be displayed
     */
    goto(route) {
        Actions.drawerClose();
        this.setState({ currentTab: route })    //change highlighted active tab

        switch (route){
            case 'Home': Actions.homeTab(); break; 
            case 'Help': Actions.helpTab(); break;
            case 'Setting': Actions.settingTab(); break;
            case 'QRScanner': Actions.QRTab(); break;
        }
    }

    render() {
        return (
            <View>
                <ScrollView style={styles.navScroll}>
                    <View style={styles.header}>
                        <Image source={require('../assets/images/Ray.png')} style={styles.avatar} />
                        <Text style={styles.headerText}>{this.state.userName}</Text>
                    </View>
                    <View style={styles.itemContainer}>
                        <TouchableOpacity onPress={() => { this.goto('Home') }}>
                            <View style={[styles.navItem, this.state.currentTab === 'Home' ? styles.activeItem : {}]}>
                                <Icon iconStyle={styles.icon} name='home' type='material-community' color={color.grey} size={24} />
                                <Text style={styles.navText}>Home</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.goto('QRScanner') }}>
                            <View style={[styles.navItem, this.state.currentTab === 'QRScanner' ? styles.activeItem : {}]}>
                                <Icon iconStyle={styles.icon} name='qrcode-scan' type='material-community' color={color.grey} size={24} />
                                <Text style={styles.navText}>QR Scanner</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.goto('Setting') }}>
                            <View style={[styles.navItem, this.state.currentTab === 'Setting' ? styles.activeItem : {}]}>
                                <Icon iconStyle={styles.icon} name='settings' type='material-community' color={color.grey} size={24} />
                                <Text style={styles.navText}>Setting</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.goto('Help') }}>
                            <View style={[styles.navItem, this.state.currentTab === 'Help' ? styles.activeItem : {}]}>
                                <Icon iconStyle={styles.icon} name='help-circle-outline' type='material-community' color={color.grey} size={24} />
                                <Text style={styles.navText}>Help</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Button title="Logout" onPress={this.onSignOut} buttonStyle={styles.button} />
                </ScrollView>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavDrawer);