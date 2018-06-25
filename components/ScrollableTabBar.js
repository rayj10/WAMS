import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { color, fontFamily, fontSize, normalize } from '../theme/baseTheme';
import * as menuAction from '../actions/menuActions';

const styles = StyleSheet.create({
    container: {
        height: normalize(60),
        backgroundColor: color.blue
    },
    overlay: {
        backgroundColor: 'rgba(0,102,178,0.05)'
    },
    textContainer: {
        flex: 1,
        width: normalize(100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: normalize(40),
        width: normalize(40),
        resizeMode: 'contain'
    },
    textStyle: {
        fontFamily: fontFamily.medium,
        fontSize: fontSize.regular - 2,
        color: color.white
    },
    activeTab: {
        borderBottomWidth: 3,
        borderColor: color.light_grey,
    }
});

//Maps store's state to Approval's props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    menuList: state.menuReducer.menuList,
    menuReceived: state.menuReducer.menuReceived,
    currentScene: state.menuReducer.currentScene
});

//Maps imported actions to Approval's props
export const mapDispatchToProps = (dispatch) => ({
    actionsMenu: bindActionCreators(menuAction, dispatch)
});

class ScrollableTabBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: null,
            currentTab: null
        }
    }

    /**
     * When Component got a props update i.e. menu received or tabbing changed, do these adjustments
     */
    componentDidUpdate() {
        //Adjust highlighted tab position
        let tabs = this.state.tabs;
        if (tabs && this.state.currentTab !== '#' + tabs[0]['MenuID'] && Actions.currentScene === '_#' + tabs[0]['MenuID'])
            this.setState({ currentTab: '#' + tabs[0]['MenuID'] });

        //if menu has just been received, grab children of this.props.tabID and sort them
        tabs = [];
        if (this.props.menuReceived && !this.state.tabs) {
            this.props.menuList.map((item) => {
                if (item['ParentMenuID'] === this.props.tabID)
                    tabs.push(item);
            });

            tabs.sort((a, b) => { return a['MenuID'] - b['MenuID'] });

            //as soon as menu is fetched, initialize the tabs and default tab
            this.setState({ tabs, currentTab: '#' + tabs[0]['MenuID'] });
            this.goto('#' + tabs[0]['MenuID']);
        }
    }

    /**
     * Determine the next scene to be displayed utilizing RNRF's Actions
     * @param {String} route: Name of screen to be displayed
     */
    goto(route) {
        this.setState({ currentTab: route })    //change highlighted active tab
        Actions.jump(route)
        this.props.actionsMenu.updateMenu(Actions.currentScene)    //notify redux state about scene change so it could update menus
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.overlay}
                    data={this.state.tabs}
                    renderItem={({ item }) => {
                        let source = "", id = '#' + item['MenuID'], name = item['MenuName'];
                        switch (item['MenuID']) {
                            case 7556: source = require('../assets/images/Approval.png'); break;
                            case 7552: source = require('../assets/images/MyRequest.png'); break;
                            case 7559: source = require('../assets/images/DOCustomer.png'); break;
                            case 7560: source = require('../assets/images/MyConfirmation.png'); break;
                            case 7562: source = require('../assets/images/ViewRequest.png'); break;
                        }
                        return (
                            <TouchableOpacity onPress={() => this.goto(id)}>
                                <View style={[styles.textContainer, this.state.currentTab === id ? styles.activeTab : {}]}>
                                    <Image style={styles.image} source={source} />
                                    <Text style={styles.textStyle}>{name}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    extraData={this.state.currentTab}
                    keyExtractor={(item) => item['MenuName']} />
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScrollableTabBar);