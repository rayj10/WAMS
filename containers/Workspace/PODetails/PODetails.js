import React from 'react';
import { Button, Header } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    View, Alert, Text,
    ScrollView, TouchableOpacity, ActivityIndicator
} from 'react-native';

import styles from "./styles";
import * as workspaceAction from '../../../actions/workspaceActions';
import IconWrapper from '../../../components/IconWrapper';
import { color, normalize } from '../../../theme/baseTheme';
import DialogBoxModal from '../../../components/DialogBoxModal';

//Maps reducer's states to RequestDetails props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    detailsReceived: state.workspaceReducer.detailsReceived,
    details: state.workspaceReducer.details
});

//Maps actions to RequestDetails props
export const mapDispatchToProps = (dispatch) => ({
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
});

class PODetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchStatus: null,
            priceSummary: false,
        };

        this.onApprove = this.onApprove.bind(this);
        this.onReject = this.onReject.bind(this);
        this.onFetchFinish = this.onFetchFinish.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this.props.actionsWorkspace.getPODetails(this.props.header[this.props.keys['id']], this.props.token, this.onFetchFinish);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    /**
     * Callback to be called when fetching process done
     * @param {String} status: Fetch status response (directly related to HTTP status code response)
     */
    onFetchFinish(status) {
        if (status === 'Authentication Denied')
            Actions.reset('Main')   //go back to workspace and workspace will logout
        else if (this.mounted && status === "success")
            this.setState({ fetchStatus: status });
        else {                      //in case data was stale and need refreshing to sync with current DB
            Alert.alert(status);
            this.props.refresh();
            setTimeout(() => Actions.pop(), 300);
        }
    }

    /**
     * What to do when Request is approved
     */
    onApprove() {

    }

    /**
     * What to do when Request is declined
     */
    onReject() {

    }

    getPriceSummary() {
        let { form } = this.props.details;
        let { keys } = this.props;
        let summary = [];

        if (form) {
            summary.push(<View key={1} style={styles.priceSumRow}>
                <Text style={styles.priceSumKeys}>{"Amount Total Base:"}</Text>
                <Text style={styles.priceSumData}>{"Rp. " + form[keys['baseTotal']]}</Text>
            </View>);
            summary.push(<View key={2} style={styles.priceSumRow}>
                <Text style={styles.priceSumKeys}>{"Amount Discount:"}</Text>
                <Text style={styles.priceSumData}>{"Rp. " + form[keys['discTotal']]}</Text>
            </View>);
            summary.push(<View key={3} style={styles.priceSumRow}>
                <Text style={styles.priceSumKeys}>{"Total:"}</Text>
                <Text style={styles.priceSumData}>{"Rp. " + form[keys['total']]}</Text>
            </View>);
            summary.push(<View key={4} style={styles.priceSumRow}>
                <Text style={styles.priceSumKeys}>{"Amount Tax:"}</Text>
                <Text style={styles.priceSumData}>{"Rp. " + form[keys['tax']]}</Text>
            </View>);
            summary.push(<View key={5} style={styles.priceSumRow}>
                <Text style={styles.priceSumKeys}>{"Shipping & Handling:"}</Text>
                <Text style={styles.priceSumData}>{"Rp. " + form[keys['SnH']]}</Text>
            </View>);
            summary.push(<View key={6} style={styles.priceSumRow}>
                <Text style={styles.priceSumKeys}>{"Grand Total:"}</Text>
                <Text style={styles.priceSumData}>{"Rp. " + form[keys['grand']]}</Text>
            </View>);
        }

        return summary;
    }

    /**
     * Render complete request form with the help of renderItems to render individual panels for items
     */
    renderRequest() {
        let content = (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator animating={true} size='large' />
            </View>);
        let status = this.state.fetchStatus;

        if (status !== null) {
            if (this.props.detailsReceived) {
                let { header, details, keys } = this.props;
                content = (
                    <ScrollView>
                        <View style={styles.requestHead}>
                            <View style={styles.subRequestHead}>
                                <Text style={styles.titleTextStyle}>{"PO No.:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['id']]}</Text>
                                <Text style={styles.titleTextStyle}>{"PO Date:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['date']]}</Text>
                                <Text style={styles.titleTextStyle}>{"Vendor:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['vendor']]}</Text>
                            </View>
                            <View style={styles.subRequestHead}>
                                <Text style={styles.titleTextStyle}>{"Created By:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['requestor']]}</Text>
                                <Text style={styles.titleTextStyle}>{"Max Receive Date:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['maxDate']]}</Text>
                                <Text style={styles.titleTextStyle}>{"Sales:"}</Text>
                                <Text style={styles.textStyle}>{details.sales[keys['sales']]}</Text>
                            </View>
                        </View>
                        <View style={styles.requestBody}>
                            {this.renderItems(details.items)}
                        </View>
                    </ScrollView>);
            }
            else {
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
                        <Text style={[styles.titleTextStyle, { textAlign: 'center', fontSize: 16 }]}>
                            {message}
                        </Text>
                    </View>
                );
            }
        }
        return content;
    }

    /**
     * Render out the items by iterating through the list of items
     * @param {Array} requestItems List of items requested
     */
    renderItems(requestItems) {
        let { keys } = this.props;

        return requestItems.map((item, key) => {
            return (
                <View style={styles.itemPanel} key={key}>
                    <View style={styles.verticalSubPanel}>
                        <Text style={[styles.titleTextStyle, { marginLeft: 1 }]}>{(key + 1) + ". " + item[keys['item']]}</Text>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Item Code:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['code']]}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Quantity:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['amount']] + " " + item[keys['unit']]}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Unit Price:"}</Text>
                            <Text style={styles.textStyle}>{"Rp. " + item[keys['uPrice']]}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Unit Discount:"}</Text>
                            <Text style={styles.textStyle}>{"Rp. " + item[keys['uDisc']]}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Net Amount:"}</Text>
                            <Text style={styles.textStyle}>{"Rp. " + item[keys['iNet']]}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Description:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['desc']]}</Text>
                        </View>
                    </View>
                </View>)
        });
    }

    render() {
        let buttons = null;

        if (this.props.caller === 'Approval') {
            buttons = (
                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <Button
                            raised
                            borderRadius={8}
                            title={'APPROVE'}
                            backgroundColor={color.green}
                            textStyle={styles.buttonText}
                            onPress={this.onApprove} />
                    </View>
                    <View style={styles.button}>
                        <Button
                            raised
                            borderRadius={8}
                            title={'REJECT'}
                            backgroundColor={color.red}
                            textStyle={styles.buttonText}
                            onPress={this.onReject} />
                    </View>
                </View>);
        }

        return (
            <View style={styles.container}>
                <DialogBoxModal
                    visible={this.state.priceSummary}
                    title={"Price Summary: "}
                    content={this.getPriceSummary()}
                    buttons={[{ text: "OK", onPress: () => this.setState({ priceSummary: false }) }]}
                />
                <Header
                    leftComponent={<IconWrapper name='chevron-left' type='font-awesome' color='white' size={28} style={styles.icon} onPress={() => Actions.pop()} />}
                    centerComponent={{ text: 'PO Details', style: styles.headerText }}
                    rightComponent={<IconWrapper name='dollar' type='font-awesome' color='white' size={28} style={styles.icon} onPress={() => this.setState({ priceSummary: true })} />}
                    outerContainerStyles={styles.headerOuterContainer} />
                <View style={styles.bodyContainer}>
                    {this.renderRequest()}
                </View>
                {buttons}
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PODetails);