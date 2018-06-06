import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { color, fontSize, fontFamily, normalize } from '../theme/baseTheme';

const styles = StyleSheet.create({
    subHeader: {
        fontSize: fontSize.large,
        fontFamily: fontFamily.bold,
        color: color.light_black
    },

    panelContainer: {
        flex: 1,
        marginBottom: normalize(30),
        paddingTop: normalize(5)
    },

    outterPanel: {
        height: normalize(75),
        flexDirection: 'row',
        borderColor: color.light_grey,
        borderRadius: 3,
        borderWidth: 1.5,
        marginVertical: 2
    },

    innerPanel: {
        flex: 1,
        justifyContent: 'space-evenly'
    },

    titleTextStyle: {
        fontSize: fontSize.small,
        fontFamily: fontFamily.bold,
    },

    textStyle: {
        fontSize: fontSize.small,
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
        return headers.map((item, key) => {
            let info = this.buildPanel(item);
            return (<TouchableOpacity onPress={() => Actions.RequestDetails({ request: item, caller: this.props.caller })} key={key}>
                <View style={styles.outterPanel}>
                    <View style={[styles.innerPanel, { flex: 3.5 }]}>
                        {info.slice(0, 3)}
                    </View>
                    <View style={styles.innerPanel}>
                        {info.slice(3)}
                    </View>
                </View>
            </TouchableOpacity>)
        });
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
        panel.push(<View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }} key={'status'}>
            <Text style={[styles.titleTextStyle, { fontSize: fontSize.regular }]}>{"Status:"}</Text>
            <Text style={[styles.titleTextStyle, { fontSize: fontSize.regular + 4 }, statusColor]}>{status}</Text>
        </View>);

        return panel;
    }

    render() {
        let { status, list } = this.props;

        let content = (
            <View style={{ marginTop: 20 }}>
                <ActivityIndicator animating={true} size='large' />
            </View>);

        if (status !== null) {
            if (status === 'Authenticated' && list != null) {
                content = this.renderSummary(list)
            }
            else if (status !== 'Authenticated') { //to make sure on cases where status is authenticated but list is null
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
                <View style={[styles.panelContainer, status === 'Authenticated' ? {} : { backgroundColor: '#f2f7fc' }]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {content}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export default SummaryListPage;