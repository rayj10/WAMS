import React from 'react';
import { Scene, Router, Actions, ActionConst, Stack } from 'react-native-router-flux';
import { AsyncStorage, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//Import Components
import Splash from './components/Splash';
import NavDrawer from './components/NavDrawer';
import PageHeader from './components/Header';
import ScrollableTabBar from './components/ScrollableTabBar';
import TakePhoto from './components/TakePhoto';

//Import Containers
import Login from './containers/Login';
import UserProfile from './containers/UserProfile';
import {
    Approval, DOCustomer, MyConfirmation,
    MyRequest, ViewPage, Report, RequestDetails,
    PODetails, TransferDetails, RequestConfirm,
    DODetails, TaskList, TaskDetails
} from './containers/Workspace';
import { QRScanner, ScanPage } from './containers/QRScanner';
import { Help, UserManual, FAQ } from './containers/Help';
import Setting from './containers/Setting';

//Import Store, actionTypes, Actions
import store from './redux/store'
import * as aType from './actions/actionTypes/authTypes';
import * as authAction from './actions/authActions';
import * as workspaceAction from './actions/workspaceActions';
import * as menuAction from './actions/menuActions';
import menuInfo from './json/menuInfo.json';
import errors from './json/errors.json';

//Maps actions to router's props
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
            toggleUpdate: false,
            avatar: null,
        }
    }

    //load token from async and update redux store with the necessary data
    componentDidMount() {
        AsyncStorage.getItem('token').then((token) => {
            setTimeout(() => {
                if (token !== null) {
                    this.props.actionsMenu.getAvailableMenu(token, (error) => {
                        if (error === 401 && this.props.token) {
                            Alert.alert(errors[error].name, errors[errror].message)
                            this.props.actionsAuth.signOut(this.props.actionsWorkspace.successSignOut.bind(this));
                            Actions.reset("Auth");
                        }
                    });
                    this.props.actionsAuth.getUserProfile(token, null, (error) => {
                        if (error === 401 && this.props.token) {
                            Alert.alert(errors[error].name, errors[error].message)
                            this.props.actionsAuth.signOut(this.props.actionsWorkspace.successSignOut.bind(this));
                            Actions.reset("Auth");
                        }
                    });
                    store.dispatch({ type: aType.LOGGED_IN, token: token });
                    this.setState({ isReady: true, isLoggedIn: true });
                }
                else {
                    store.dispatch({ type: aType.LOGGED_OUT });
                    this.setState({ isReady: true, isLoggedIn: false })
                }
            }, 1000)
        });
    }

    /**
     * Callback to be executed when Android hardware back button pressed
     */
    handleBackButton() {
        if (Actions.currentScene === '_MyRequest') {
            this.props.actionsAuth.signOut(this.props.actionsWorkspace.successSignOut.bind(this));
            Actions.reset("Auth");
        }
        else if (Actions.currentScene === 'Login')
            BackHandler.exitApp();
        else if (Actions.currentScene === 'PODetails') { }//do nothing, handled with PODetails own listener
        else {
            Actions.pop()
            this.props.actionsMenu.updateMenu(Actions.currentScene)  //notify redux state about scene change so it could update menus
        }

        return true;
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
                        <Scene drawer key="NavDrawer" hideNavBar contentComponent={NavDrawer} type={ActionConst.REPLACE} panHandlers={null}>
                            <Scene key="Workspace" navBar={() => <PageHeader title='Workspace' />} drawerLockMode={'locked-closed'}>
                                <Scene tabs={true} tabBarComponent={() => <ScrollableTabBar tabID={menuInfo.Constants.WORKSPACE} />} tabBarPosition='top' lazy={true} animationEnabled={false} swipeEnabled={false}>
                                    <Scene key="My Request" hideNavBar component={MyRequest} title={"My Request"} />
                                    <Scene key="Approval" hideNavBar component={Approval} title={"Approval"} />
                                    <Scene key="DO Customer" hideNavBar component={DOCustomer} title={"DO Customer"} />
                                    <Scene key="My Confirmation" hideNavBar component={MyConfirmation} title={"My Confirmation"} />
                                    <Scene key="View" hideNavBar component={ViewPage} title={"View"} />
                                    <Scene key="Report" hideNavBar component={Report} title={"Report"} />
                                    <Scene key="Task List" hideNavBar component={TaskList} title="Task List" />
                                </Scene>
                                <Scene key="RequestDetails" hideNavBar component={RequestDetails} title="Request Details" />
                                <Scene key="PODetails" hideNavBar component={PODetails} title="PO Details" />
                                <Scene key="TransferDetails" hideNavBar component={TransferDetails} title="Transfer Details" />
                                <Scene key="RequestConfirm" hideNavBar component={RequestConfirm} title="Request Confirm" />
                                <Scene key="DODetails" hideNavBar component={DODetails} title="DO Details" />
                                <Scene key="TaskDetails" hideNavBar component={TaskDetails} title="Task Details" />
                            </Scene>
                            <Scene key="Help" navBar={() => <PageHeader title='Help' />} title="Help" drawerLockMode={'locked-closed'}>
                                <Scene tabs={true} hideTabBar animationEnabled={false} swipeEnabled={false} lazy={true}>
                                    <Scene key="Help" hideNavBar component={Help} title={"Help"} />
                                    <Scene key="User Manual" hideNavBar component={UserManual} title={"User Manual"} />
                                    <Scene key="FAQ" hideNavBar component={FAQ} title={"FAQ"} />
                                </Scene>
                            </Scene>
                            <Scene key="Setting" navBar={() => <PageHeader title='Setting' />} title="Setting" drawerLockMode={'locked-closed'}>
                                <Scene>
                                    <Scene key="Setting" hideNavBar component={Setting} title={"Setting"} />
                                </Scene>
                            </Scene>
                            <Scene key="QR Scanner" navBar={() => <PageHeader title='QR Scanner' />} title="QR" drawerLockMode={'locked-closed'}>
                                <Scene tabs={true} hideTabBar animationEnabled={false} swipeEnabled={false} lazy={true}>
                                    <Scene key="QR Scanner" hideNavBar component={QRScanner} title={"QR Scanner"} />
                                    <Scene key="ScanPage" hideNavBar component={ScanPage} title={"ScanPage"} />
                                </Scene>
                            </Scene>
                            <Scene key="UserProfile" hideNavBar title="QR" drawerLockMode={'locked-closed'}>
                                <Scene tabs={true} hideTabBar animationEnabled={false} swipeEnabled={false} lazy={true}>
                                    <Scene key="UserProfile" hideNavBar component={UserProfile} title="UserProfile" drawerLockMode={'locked-closed'} />
                                    <Scene key="TakePhoto" hideNavBar component={TakePhoto} title="TakePhoto" drawerLockMode={'locked-closed'} />
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