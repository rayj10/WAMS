import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import Expand from 'react-native-simple-expand';

import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../theme/baseTheme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        borderWidth: 0
    },

    header: {
        height: normalize(50),
        paddingLeft: normalize(20),
        borderRadius: normalize(8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: color.light_grey
    },

    headerText: {
        fontFamily: fontFamily.bold,
        fontSize: fontSize.large - 4
    },

    icon: {
        color: color.light_black,
        marginRight: normalize(30)
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

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.setState({ open: !this.state.open })}>
                    <View style={this.props.containerStyle ? this.props.containerStyle : styles.header}>
                        <Text style={[styles.headerText, this.props.font, this.props.size]}>
                            {this.props.title}
                        </Text>
                        {expandIcon}
                    </View>
                </TouchableOpacity>
                <Expand value={this.state.open}>
                    {this.props.body}
                </Expand>
            </View>
        );
    }
}

export default Accordion;