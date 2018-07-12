import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView, Alert, Image, FlatList
} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as menuAction from '../actions/menuActions';
import * as authAction from '../actions/authActions';
import * as workspaceAction from '../actions/workspaceActions';
import { color, fontFamily, fontSize, normalize } from '../theme/baseTheme';
import { Avatar } from '../assets/images';
import * as links from '../utils/links';

//Maps reducer's state to NavDrawer's props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    username: state.authReducer.userName,
    menuList: state.menuReducer.menuList,
    menuReceived: state.menuReducer.menuReceived,
    currentScene: state.menuReducer.currentScene
});

//Maps actions to NavDrawer's props
export const mapDispatchToProps = (dispatch) => ({
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
    actionsAuth: bindActionCreators(authAction, dispatch),
    actionsMenu: bindActionCreators(menuAction, dispatch)
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
            initialPage: null,
            userName: name ? name.charAt(0).toUpperCase() + name.slice(1) : null,       //user's name to be displayed on avatar
        }

        this.goto = this.goto.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
        this.pictureTaken = this.pictureTaken.bind(this);
        this.usePicture = this.usePicture.bind(this);
        this.newPicture = this.newPicture.bind(this);
    }

    componentDidMount() {
        //When menu is fetched and component mounted, initialize the tabs and default tab
        if (this.props.menuReceived && !this.state.tabs) {
            let tabs = this.props.menuList;
            this.setState({ tabs, currentTab: links.IDtoName(tabs[0]['MenuID']), initialPage: links.IDtoName(tabs[0]['Children'][0]['MenuID']) });
            this.goto(links.IDtoName(tabs[0]['MenuID']));
        }
    }

    /**
     * When Component got a props update i.e. menu received or tabbing changed, do these adjustments
     */
    componentDidUpdate() {
        let tabs = this.props.menuList;

        //Adjust highlighted tab position
        if (this.props.menuReceived && this.state.currentTab !== links.IDtoName(tabs[0]['MenuID']) && Actions.currentScene === '_' + this.state.initialPage)
            this.setState({ currentTab: links.IDtoName(tabs[0]['MenuID']) })

        //When is fetched, initialize the tabs and default tabs
        if (this.props.menuReceived && !this.state.tabs) {
            this.setState({ tabs, currentTab: links.IDtoName(tabs[0]['MenuID']), initialPage: links.IDtoName(tabs[0]['Children'][0]['MenuID']) });
            this.goto(links.IDtoName(tabs[0]['MenuID']));
        }
    }

    /**
     * When user clicks Logout button from Drawer
     * use signOut() from auth's actions.js 
     */
    onSignOut() {
        this.props.actionsAuth.signOut(this.props.actionsWorkspace.successSignOut.bind(this));
        Actions.reset("Auth");
    }

    /**
     * Determine the next scene to be displayed utilizing RNRF's Actions
        @param {String} route: Name of screen to be displayed
     */
    goto(route) {
        Actions.drawerClose();
        if (this.state.currentTab !== route) {
            this.setState({ currentTab: route })                       //change highlighted active tab
            Actions[route].call();
            this.props.actionsMenu.updateMenu(Actions.currentScene)    //notify redux state about scene change so it could update menus
        }
    }

    pictureTaken(uri) {
        Actions.Photo({ uri, usePicture: this.usePicture, newPicture: this.newPicture });
    }

    usePicture(uri){
        //save to async and redux
        //change avatar state
    }

    newPicture(){
        Actions.pop();
        Actions.CameraPage({ pictureTaken: this.pictureTaken });
    }

    render() {
        return (
            <View>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => Actions.CameraPage({ pictureTaken: this.pictureTaken })}>
                        <Image source={Avatar} style={styles.avatar} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>{this.state.userName}</Text>
                </View>
                <View style={styles.itemContainer}>
                    <FlatList showVerticalScrollIndicator={false}
                        data={this.state.tabs}
                        renderItem={({ item }) => {
                            let source = links.IDtoIcon(item['MenuID']),
                                name = links.IDtoName(item['MenuID']);

                            return (
                                <TouchableOpacity onPress={() => this.goto(name)}>
                                    <View style={[styles.navItem, this.state.currentTab === name ? styles.activeItem : {}]}>
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