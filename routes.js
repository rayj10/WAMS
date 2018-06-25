import React from 'react';
import { Scene, Router, Actions, ActionConst, Stack } from 'react-native-router-flux';
import { AsyncStorage, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Components
import Splash from './components/Splash';
import NavDrawer from './components/NavDrawer';
import PageHeader from './components/Header';
import ScrollableTabBar from './components/ScrollableTabBar';

//Import Containers
import Login from './containers/Login';
import { Approval, DOCustomer, MyConfirmation, MyRequest, ViewRequest, RequestDetails } from './containers/Workspace';
import QRScanner from './containers/QRScanner';
import { Help, UserManual, FAQ } from './containers/Help';
import Setting from './containers/Setting';

//Import Store, actionTypes, Actions
import store from './redux/store'
import * as aType from './actions/actionTypes/authTypes';
import * as authAction from './actions/authActions';
import * as workspaceAction from './actions/workspaceActions';
import * as menuAction from './actions/menuActions';

//Maps actions to NavDrawer's props
export const mapDispatchToProps = (dispatch) => ({
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
    actionsAuth: bindActionCreators(authAction, dispatch),
    actionsMenu: bindActionCreators(menuAction, dispatch)
});

class Routes extends React.Component {
    constructor() {
        super();
        this.state = {
            isReady: false,
            isLoggedIn: false,
            toggleUpdate: false
        }
    }

    //load name and token from async and put it in redux's state
    componentDidMount() {
        AsyncStorage.getItem('username').then(name => {
            AsyncStorage.getItem('token').then((data) => {
                setTimeout(() => {
                    if (data !== null) {
                        store.dispatch({ type: aType.LOGGED_IN, token: data, userName: name });
                        this.setState({ isReady: true, isLoggedIn: true });
                    }
                    else {
                        store.dispatch({ type: aType.LOGGED_OUT });
                        this.setState({ isReady: true, isLoggedIn: false })
                    }
                }, 3000)
            });
        });
    }

    /**
     * Callback to be called when Android hardware back button pressed
     */
    handleBackButton() {
        if (Actions.currentScene === '_#7552')
            this.onSignOut()
        else if (Actions.currentScene === 'Login')
            BackHandler.exitApp();
        else {
            Actions.pop()
            this.props.actionsMenu.updateMenu(Actions.currentScene)  //notify redux state about scene change so it could update menus
        }

        return true;
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

    render() {
        if (!this.state.isReady)
            return <Splash />
        return (
            <Router backAndroidHandler={this.handleBackButton.bind(this)}	>
                <Scene key="root" hideNavBar>
                    <Stack key="Auth" initial={!this.state.isLoggedIn}>
                        <Scene key="Login" hideNavBar component={Login} title="Login" />
                    </Stack>
                    <Stack key="Main" initial={this.state.isLoggedIn}>
                        <Scene drawer key="NavDrawer" hideNavBar contentComponent={() => <NavDrawer tabID={7540} />} type={ActionConst.REPLACE} panHandlers={null}>
                            <Scene key="#7546" navBar={() => <PageHeader title='Workspace' />} drawerLockMode={'locked-closed'}>
                                <Scene tabs={true} tabBarComponent={() => <ScrollableTabBar tabID={7546} />} tabBarPosition='top' lazy={true} animationEnabled={false} swipeEnabled={false}>
                                    <Scene key="#7552" hideNavBar component={MyRequest} title={"My Request"} />
                                    <Scene key="#7556" hideNavBar component={Approval} title={"Approval"} />
                                    <Scene key="#7559" hideNavBar component={DOCustomer} title={"DO Customer"} />
                                    <Scene key="#7560" hideNavBar component={MyConfirmation} title={"My Confirmation"} />
                                    <Scene key="#7562" hideNavBar component={ViewRequest} title={"View Request"} />
                                </Scene>
                                <Scene key="RequestDetails" hideNavBar component={RequestDetails} title="Request Details" />
                            </Scene>
                            <Scene key="#7564" navBar={() => <PageHeader title='Help' />} title="Help" drawerLockMode={'locked-closed'}>
                                <Scene tabs={true} hideTabBar animationEnabled={false} swipeEnabled={false} lazy={true}>
                                    <Scene key="Help" hideNavBar component={Help} title={"Help"} />
                                    <Scene key="UserManual" hideNavBar component={UserManual} title={"User Manual"} />
                                    <Scene key="FAQ" hideNavBar component={FAQ} title={"FAQ"} />
                                </Scene>
                            </Scene>
                            <Scene key="#7565" navBar={() => <PageHeader title='Settings' />} title="Settings" drawerLockMode={'locked-closed'}>
                                <Scene>
                                    <Scene key="Setting" hideNavBar component={Setting} title={"Setting"} />
                                </Scene>
                            </Scene>
                            <Scene key="#7566" navBar={() => <PageHeader title='QR Scanner' />} title="QR" drawerLockMode={'locked-closed'}>
                                <Scene>
                                    <Scene key="QRScanner" hideNavBar component={QRScanner} title={"QR Scanner"} />
                                </Scene>
                            </Scene>
                        </Scene>
                    </Stack>
                </Scene>
            </Router>
        )
    }
}

export default connect(null, mapDispatchToProps)(Routes);