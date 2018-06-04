import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { color, fontSize, fontFamily, normalize } from '../theme/baseTheme';

const styles = StyleSheet.create({
    subHeader: {
        fontSize: fontSize.large - 6,
        fontFamily: fontFamily.bold,
        color: color.light_black,
        marginLeft: normalize(30),
        marginTop: normalize(30),
        marginBottom: normalize(10),
    },

    panelContainer: {
        flex: 1,
        marginLeft: normalize(30),
        marginRight: normalize(30),
        marginBottom: normalize(60),
        borderColor: color.grey,
        borderRadius: 2,
        borderWidth: 2
    },

    dataPanel: {
        justifyContent: "center",
        height: normalize(75),
        borderColor: color.light_grey,
        borderRadius: 3,
        borderWidth: 1.5,
        marginLeft: 1,
        marginRight: 1
    },

    titleTextStyle: {
        fontSize: fontSize.small - 2,
        fontFamily: fontFamily.bold,
    },

    textStyle: {
        flex: 1,
        fontSize: fontSize.small - 2,
        fontFamily: fontFamily.light,
    }
});

class SummaryListPage extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Render out clickable summary (header) panels
     * @param {Array} headers: list of header information to be rendered
     */
    renderSummary(headers) {
        return headers.map((item, key) =>
            (<TouchableOpacity onPress={() => Actions.RequestDetails({ request: item, caller: this.props.caller })} key={key}>
                <View style={styles.dataPanel}>
                    {this.buildPanel(item)}
                </View>
            </TouchableOpacity>)
        );
    }

    /**
     * Pick out desired information from header to be rendered
     * @param {Object} item: individual header information from the mapped array in renderRequestSummary
     */
    buildPanel(item) {
        let panel = [];

        //determine color code for status
        let statusColor = { color: '#3fd130' };
        let status = item["StatusName"];
        if (status === 'Reject' || status === 'Cancel')
            statusColor = { color: '#ff3030' }
        else if (status === 'Open')
            statusColor = { color: '#ffae19' }

        panel.push(<Text style={{ left: 15 }} key={'reqNo'}>
            <Text style={styles.titleTextStyle}>{"Request No.: "}</Text>
            <Text style={styles.textStyle}>{item["RequestNo"]}</Text>
        </Text>);
        panel.push(<Text style={{ left: 15 }} key={'depNum'}>
            <Text style={styles.titleTextStyle}>{"Department Name: "}</Text>
            <Text style={styles.textStyle}>{item["dept_nm"]}</Text>
        </Text>);
        panel.push(<Text style={{ left: 15 }} key={'reqDate'}>
            <Text style={styles.titleTextStyle}>{"Request Date: "}</Text>
            <Text style={styles.textStyle}>{item["RequestDate"]}</Text>
        </Text>);
        panel.push(<Text style={{ left: 15 }} key={'status'}>
            <Text style={styles.titleTextStyle}>{"Status: "}</Text>
            <Text style={[styles.titleTextStyle, statusColor]}>{status}</Text>
        </Text>);

        return panel;
    }

    render() {
        let { status, list } = this.props;

        let content = (
            <View style={{ marginTop: 20 }}>
                <ActivityIndicator animating={true} size='large' />
            </View>);

        if (status !== null) {
            if (status === 'Authenticated') {
                content = this.renderSummary(list)
            }
            else {
                //determine message based on status
                let message = '';
                if (status === 'Service Unavailable')
                    message = 'Connection to the server is currently unavailable\nEither your internet connection is unstable or server is simply unavailable';
                else if (status === 'Access Denied')
                    message = 'Your account is not\nauthorized\nto see this information';
                else if (status === 'Unknown Error')
                    message = 'Sorry, but we are currently unable to diagnose the problem, please try again later';

                content = (
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.titleTextStyle, { textAlign: 'center', fontSize: 20 }]}>{'\n\n' + status + '\n'}</Text>
                        <Text style={[styles.titleTextStyle, { textAlign: 'center', fontSize: 16 }]}>{message}</Text>
                    </View>
                );
            }
        }

        return (
            <View style={{ flex: 1 }}>
                <Text style={styles.subHeader}>{this.props.title}</Text>
                <View style={styles.panelContainer}>
                    <ScrollView>
                        {content}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export default SummaryListPage;