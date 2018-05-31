import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { color, fontFamily, fontSize, normalize } from '../theme/baseTheme';

const styles = StyleSheet.create({
    container: {
        height: normalize(60),
        backgroundColor: color.blue
    },
    overlay: {
        backgroundColor: 'rgba(0,102,178,0.05)'
    },
    textContainer: {
        flex:1,
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
        fontSize: fontSize.regular-2,
        color: color.white
    },
    activeTab: {
        borderBottomWidth: 3,
        borderColor: color.light_grey,
    }
});

class ScrollableTabBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            currentTab: null
        }
    }

    componentDidMount() {
        let menu = this.getMenu();
        //re-initialize tab highlight and actual tab to first tab everytime tab bar remounted
        this.goto(menu[0])
        this.setState({ tabs: menu, currentTab: menu[0] });
    }

    componentDidUpdate() {
        if (this.state.currentTab !== 'Approval' && Actions.currentScene === '_Approval')
            this.setState({ currentTab: 'Approval' });
    }

    /**
     * Fetch a list of menus available for the user
     */
    getMenu() {
        return ["Approval", "My Request", "DO Customer", "My Confirm", "View Request"];
    }

    /**
     * Determine the next scene to be displayed utilizing RNRF's Actions
     * @param {String} route: Name of screen to be displayed
     */
    goto(route) {
        this.setState({ currentTab: route })    //change highlighted active tab

        switch (route){
            case 'Approval': Actions.Approval(); break; 
            case 'My Request': Actions.MyRequest(); break;
            case 'DO Customer': Actions.DOCustomer(); break;
            case 'My Confirm': Actions.MyConfirm(); break;
            case 'View Request': Actions.ViewRequest(); break; 
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.overlay}
                    data={this.state.tabs}
                    renderItem={({ item }) => {
                        let source = "";
                        switch (item) {
                            case 'Approval': source = require('../assets/images/Approval.png'); break; 
                            case 'My Request': source = require('../assets/images/MyRequest.png'); break;
                            case 'DO Customer': source = require('../assets/images/DOCustomer.png'); break;
                            case 'My Confirm': source = require('../assets/images/MyConfirm.png'); break;
                            case 'View Request': source = require('../assets/images/ViewRequest.png'); break;
                        }
                        return (
                            <TouchableOpacity onPress={() => this.goto(item)}>
                                <View style={[styles.textContainer, this.state.currentTab === item ? styles.activeTab : {}]}>
                                    <Image style={styles.image} source={source} />
                                    <Text style={styles.textStyle}>{item}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    extraData={this.state.currentTab} 
                    keyExtractor = {(item)=>item}/>
            </View>
        );
    }
}

export default ScrollableTabBar;