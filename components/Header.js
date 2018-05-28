import React from 'react';
import { Header } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { StyleSheet } from 'react-native';

import IconWrapper from './IconWrapper';
import { color, fontSize, fontFamily } from '../theme/baseTheme';

const styles = StyleSheet.create({
    headerText: {
        fontSize: fontSize.large+2,
        fontFamily: fontFamily.medium,
        color: color.white,
        padding: 10,
        marginRight: 30 //to center the title, because there's no right component
    },

    headerOuterContainer: {
        backgroundColor: color.dark_blue,
        height: 75,
        padding: 0,
        borderBottomWidth: 0,
    },
});

class PageHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
                <Header
                    leftComponent={<IconWrapper name='menu' color='white' size={33} onPress={() => Actions.drawerOpen()} />}
                    centerComponent={{ text: this.props.title, style: styles.headerText }}
                    outerContainerStyles={styles.headerOuterContainer}
                />
        )
    }
}

export default PageHeader;
