import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Expand from 'react-native-simple-expand';

import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../theme/baseTheme';

const styles = StyleSheet.create({
    header: {
        height: 50,
        paddingLeft: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: color.light_grey
    },

    headerText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.large-4
    },

    icon: {
        color: color.light_black,
        marginRight: 30
    },

    content: {
        backgroundColor: color.white,
        marginLeft: 5,
        marginRight: 5,
        padding: 20,
    },

    contentText: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.regular,
        textAlign: 'justify'
    }
});

class Accordion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }

    render() {
        let expandIcon = <Icon iconStyle={styles.icon} name='expand-more' size={32} />
        if (this.state.open)
            expandIcon = <Icon iconStyle={styles.icon} name='expand-less' size={32} />

        var header = (
            <View style={styles.header}>
                <Text style={styles.headerText}>{this.props.title}</Text>
                {expandIcon}
            </View>
        );

        var content = (
            <View style={styles.content}>
                <Text style={styles.contentText}>
                    {this.props.body}
                </Text>
            </View>
        );

        return (
            <View style={{flex:1, padding: 0, borderWidth: 0, }}>
                <TouchableOpacity onPress={() => this.setState({ open: !this.state.open })}>
                    {header}
                </TouchableOpacity>
                <Expand value={this.state.open}>
                    {content}
                </Expand>
            </View>
        );
    }
}

export default Accordion;