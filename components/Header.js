import React from 'react';
import { Header } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { StyleSheet, View } from 'react-native';

import OfflineNotice from './OfflineNotice';
import IconWrapper from './IconWrapper';
import { color, fontSize, fontFamily, normalize } from '../theme/baseTheme';

const styles = StyleSheet.create({
    headerText: {
        fontSize: fontSize.large + 2,
        fontFamily: fontFamily.medium,
        color: color.white,
        padding: normalize(10)
    },

    headerOuterContainer: {
        backgroundColor: color.blue,
        height: normalize(75),
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
            <View>
                <Header
                    leftComponent={<IconWrapper name='menu' color='white' size={33} onPress={() => Actions.drawerOpen()} />}
                    centerComponent={{ text: this.props.title, style: styles.headerText }}
                    rightComponent={<View style={{ width: 40 }} />}
                    outerContainerStyles={styles.headerOuterContainer}
                />
                <OfflineNotice />
            </View>
        )
    }
}

export default PageHeader;
