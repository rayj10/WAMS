import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView, Alert, Image, BackHandler,
    Platform, FlatList
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as authAction from '../actions/authActions';
import * as workspaceAction from '../actions/workspaceActions';
import { color, fontFamily, fontSize, normalize } from '../theme/baseTheme';

//Maps reducer's state to NavDrawer's props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    username: state.authReducer.userName,
    menuList: state.workspaceReducer.menuList,
    menuReceived: state.workspaceReducer.menuReceived
});

//Maps actions to NavDrawer's props
export const mapDispatchToProps = (dispatch) => ({
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
    actionsAuth: bindActionCreators(authAction, dispatch)
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        height: normalize(215),
        paddingTop: normalize(30),
        backgroundColor: '#f2f7fc',
        alignItems: 'center'
    },
    avatar: {
        height: normalize(140),
        width: normalize(140),
        borderRadius: normalize(70)
    },
    headerText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.large
    },
    itemContainer: {
        marginTop: 1
    },
    icon: {
        paddingRight: normalize(10)
    },
    navItem: {
        padding: normalize(15),
        flexDirection: 'row',
        alignItems: 'center'
    },
    navText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.regular + 2,
    },
    activeItem: {
        backgroundColor: 'rgba(187,189,192,0.7)', //color.light_grey with opacity adjusted
        borderRightWidth: 4,
        borderColor: color.blue
    },
    button: {
        marginTop: normalize(15),
        backgroundColor: color.light_blue,
        borderRadius: 4
    }
});

class NavDrawer extends React.Component {
    constructor(props) {
        super(props);

        let name = this.props.username;

        this.state = {
            tabs: null,
            currentTab: null,                                                           //marks which drawer item to highlight based on active scene
            userName: name ? name.charAt(0).toUpperCase() + name.slice(1) : null,       //user's name to be displayed on avatar
        }

        this.goto = this.goto.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
        this.handleBackButton = this.handleBackButton.bind(this);
    }

    /**
     * Callback to be called when Android hardware back button pressed
     */
    handleBackButton() {
        console.log(Actions.currentScene)
        if (this.state.currentTab === "Workspace")
            this.onSignOut()
        else if (Actions.currentScene === 'Login')
            BackHandler.exitApp();
        else {

            Actions.pop();
        }
        return true;
    }

    componentDidMount() {
        this.props.actionsWorkspace.getAvailableMenu(this.props.token);

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
        if (this.state.currentTab !== 'Workspace' && Actions.currentScene === '_Approval')
            this.setState({ currentTab: 'Workspace' })

        let tabs = [];
        if (this.props.menuReceived && !this.state.tabs) {
            this.props.menuList.map((item) => {
                if (item['ParentMenuID'] === this.props.tabID)
                    tabs.push(item);
            });

            //as soon as menu is fetched, initialize the tabs and default tab
            this.setState({ tabs, currentTab: '#' + tabs[0]['MenuID'] });
            this.goto('#' + tabs[0]['MenuID']);
        }
    }

    /**
     * Success case callback function
     * Call workspace's successSignOut() in actions.js to reset workspace reducer's state
     * and go back to login screen
     */
    onSuccess() {
        this.props.actionsWorkspace.successSignOut();
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
        Actions[route].call();
    }

    render() {
        return (
            <View>
                <View style={styles.header}>
                    <Image source={require('../assets/images/Ray.png')} style={styles.avatar} />
                    <Text style={styles.headerText}>{this.state.userName}</Text>
                </View>
                <View style={styles.itemContainer}>
                    <FlatList showVerticalScrollIndicator={false}
                        data={this.state.tabs}
                        renderItem={({ item }) => {
                            let source = "", id = '#' + item['MenuID'], name = item['MenuName'];
                            switch (item['MenuID']) {
                                case 7546: source = { name: 'briefcase', type: 'font-awesome' }; break;
                                case 7565: source = { name: 'gears', type: 'font-awesome' }; break;
                                case 7564: source = { name: 'help-circle', type: 'material-community' }; break;
                                case 7566: source = { name: 'qrcode', type: 'material-community' }; break;
                            }
                            return (
                                <TouchableOpacity onPress={() => this.goto(id)}>
                                    <View style={[styles.navItem, this.state.currentTab === id ? styles.activeItem : {}]}>
                                        <Icon iconStyle={styles.icon} name={source['name']} type={source['type']} color={color.grey} size={24} />
                                        <Text style={styles.navText}>{name}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        extraData={this.state.currentTab}
                        keyExtractor={(item) => item['MenuName']} />
                </View>
                <Button title="Logout" onPress={this.onSignOut} buttonStyle={styles.button} />
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavDrawer);