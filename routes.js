import React from 'react';
import { Scene, Router, ActionConst, Stack } from 'react-native-router-flux';
import { AsyncStorage, StyleSheet } from 'react-native';

//Import Components
import Splash from './components/Splash';
import NavDrawer from './components/NavDrawer';
import PageHeader from './components/Header';
import ScrollableTabBar from './components/ScrollableTabBar';
import QRScanner from './components/QRScanner';

//Import Containers
import Login from './containers/Login';
import Approval from './containers/Home/Approval';
import RequestDetails from './containers/Home/RequestDetails';
import DOCustomer from './containers/Home/DOCustomer';
import MyConfirm from './containers/Home/MyConfirm';
import MyRequest from './containers/Home/MyRequest';
import ViewRequest from './containers/Home/ViewRequest';
import Help from './containers/Help';
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
                        <Scene drawer key="NavDrawer" hideNavBar contentComponent={NavDrawer} type={ActionConst.REPLACE} panHandlers={null}>
                            <Scene key="homeTab" navBar={() => <PageHeader title='Workspace' />} drawerLockMode={'locked-closed'}>
                                <Scene tabs={true} tabBarComponent={ScrollableTabBar} tabBarPosition='top' lazy={true} animationEnabled={false} swipeEnabled={false}>
                                    <Scene key="Approval" hideNavBar component={Approval} title={"Approval"}/>
                                    <Scene key="DOCustomer" hideNavBar component={DOCustomer} title={"DOCustomer"}/>
                                    <Scene key="MyConfirm" hideNavBar component={MyConfirm} title={"MyConfirm"}/>
                                    <Scene key="MyRequest" hideNavBar component={MyRequest} title={"MyRequest"}/>
                                    <Scene key="ViewRequest" hideNavBar component={ViewRequest} title={"ViewRequest"}/>
                                </Scene>
                                <Scene key="RequestDetails" hideNavBar component={RequestDetails} title="Request Details"/>
                            </Scene>
                            <Scene key="helpTab" navBar={() => <PageHeader title='Help' />} title="Help" drawerLockMode={'locked-closed'}>
                                <Scene>
                                    <Scene key="Help" hideNavBar component={Help} title={"Help"} />
                                </Scene>
                            </Scene>
                            <Scene key="settingTab" navBar={() => <PageHeader title='Settings' />} title="Settings" drawerLockMode={'locked-closed'}>
                                <Scene>
                                    <Scene key="Setting" hideNavBar component={Setting} title={"Setting"} />
                                </Scene>
                            </Scene>
                            <Scene key="QRTab" navBar={() => <PageHeader title='QR Scanner' />} title="QR" drawerLockMode={'locked-closed'}>
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
