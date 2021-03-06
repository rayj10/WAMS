import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { color, fontFamily, fontSize, normalize } from '../theme/baseTheme';
import * as menuAction from '../actions/menuActions';
import { getIcon } from '../assets/images';
import menuInfo from '../json/menuInfo.json';

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
        width: normalize(70),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: normalize(3),
        opacity: 0.5
    },
    image: {
        height: normalize(50),
        width: normalize(50),
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
        opacity: 1
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

    componentDidMount() {
        //When menu is fetched and component mounted, initialize the tabs and default tab
        if (this.props.menuReceived && !this.state.tabs && this.props.menuList.length > 0) {
            let tabs = this.props.menuList.find((item) => item['MenuID'] === this.props.tabID)['Children'];
            this.setState({ tabs, currentTab: menuInfo[tabs[0]].name });
            this.goto(menuInfo[tabs[0]].name);
        }
    }

    /**
     * When Component got a props update i.e. menu received or tabbing changed, do these adjustments
     */
    componentDidUpdate() {
        //Adjust highlighted tab position
        let tabs = this.state.tabs;
        if (tabs && this.state.currentTab !== menuInfo[tabs[0]].name && Actions.currentScene === '_' + menuInfo[tabs[0]].name)
            this.setState({ currentTab: menuInfo[tabs[0]].name });

        //When menu is fetched, initialize the tabs and default tab
        if (this.props.menuReceived && !this.state.tabs && this.props.menuList.length > 0) {
            tabs = this.props.menuList.find((item) => item['MenuID'] === this.props.tabID)['Children'];
            this.setState({ tabs, currentTab: menuInfo[tabs[0]].name });
            this.goto(menuInfo[tabs[0]].name);
        }
    }

    /**
     * Determine the next scene to be displayed utilizing RNRF's Actions
     * @param {String} route: Name of screen to be displayed
     */
    goto(route) {
        this.setState({ currentTab: route })                       //change highlighted active tab
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
                        let source = getIcon(item),
                            name = menuInfo[item].name;

                        return (
                            <TouchableOpacity onPress={() => this.goto(name)}>
                                <View style={[styles.textContainer, this.state.currentTab === name ? styles.activeTab : {}]}>
                                    <Image style={styles.image} source={source} />
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    extraData={this.state.currentTab}
                    keyExtractor={(item) => `${item}`} />
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScrollableTabBar);