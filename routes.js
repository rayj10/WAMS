import React from 'react';
import { Scene, Router, ActionConst, Stack } from 'react-native-router-flux';
import { AsyncStorage, StyleSheet } from 'react-native';

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

//Import Store, actionTypes
import store from './redux/store'
import * as aType from './actions/actionTypes/authTypes';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            isReady: false,
            isLoggedIn: false,
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

    render() {
        if (!this.state.isReady)
            return <Splash />
        return (
            <Router>
                <Scene key="root" hideNavBar>
                    <Stack key="Auth" initial={!this.state.isLoggedIn}>
                        <Scene key="Login" hideNavBar component={Login} title="Login" />
                    </Stack>
                    <Stack key="Main" initial={this.state.isLoggedIn}>
        <Scene drawer key="NavDrawer" hideNavBar contentComponent={()=><NavDrawer tabID={7540}/>} type={ActionConst.REPLACE} panHandlers={null}>
                            <Scene key="#7546" navBar={() => <PageHeader title='Workspace' />} drawerLockMode={'locked-closed'}>
                                <Scene tabs={true} tabBarComponent={()=><ScrollableTabBar tabID={7546}/>} tabBarPosition='top' lazy={true} animationEnabled={false} swipeEnabled={false}>
                                    <Scene key="#7556" hideNavBar component={Approval} title={"Approval"} />
                                    <Scene key="#7559" hideNavBar component={DOCustomer} title={"DO Customer"} />
                                    <Scene key="#7560" hideNavBar component={MyConfirmation} title={"My Confirmation"} />
                                    <Scene key="#7552" hideNavBar component={MyRequest} title={"My Request"} />
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
