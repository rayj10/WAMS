import React from 'react';
import { Button, Header } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    View, Alert, Text,
    ScrollView, TouchableOpacity, ActivityIndicator,
    Linking
} from 'react-native';

import styles from "./styles";
import * as workspaceAction from '../../../actions/workspaceActions';
import IconWrapper from '../../../components/IconWrapper';
import { color, normalize, fontSize } from '../../../theme/baseTheme';
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
            vendorDetails: false,
            salesDetails: false
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
     * What to do when PO is approved
     */
    onApprove() {

    }

    /**
     * What to do when PO is declined
     */
    onReject() {

    }

    /**
     * Returns an extracted information on a PO's price summary in the form of Array of formatted JSX objects
     */
    getPriceSummary() {
        let { form } = this.props.details;
        let { keys } = this.props;
        let summary = [];

        if (form) {
            summary.push(<View key={1} style={styles.priceSumRow}>
                <Text style={styles.priceSumKeys}>{"Amount Total Base:"}</Text>
                <Text style={styles.priceSumData}>{"Rp. " + form[keys['baseTotal']].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
            </View>);
            summary.push(<View key={2} style={styles.priceSumRow}>
                <Text style={styles.priceSumKeys}>{"Amount Discount:"}</Text>
                <Text style={styles.priceSumData}>{"Rp. " + form[keys['discTotal']].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
            </View>);
            summary.push(<View key={3} style={styles.priceSumRow}>
                <Text style={styles.priceSumKeys}>{"Total:"}</Text>
                <Text style={styles.priceSumData}>{"Rp. " + form[keys['total']].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
            </View>);
            summary.push(<View key={4} style={styles.priceSumRow}>
                <Text style={styles.priceSumKeys}>{"Amount Tax:"}</Text>
                <Text style={styles.priceSumData}>{"Rp. " + form[keys['tax']].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
            </View>);
            summary.push(<View key={5} style={styles.priceSumRow}>
                <Text style={styles.priceSumKeys}>{"Shipping & Handling:"}</Text>
                <Text style={styles.priceSumData}>{"Rp. " + form[keys['SnH']].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
            </View>);
            summary.push(<View key={6} style={styles.priceSumRow}>
                <Text style={styles.priceSumKeys}>{"Grand Total:"}</Text>
                <Text style={styles.priceSumData}>{"Rp. " + form[keys['grand']].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
            </View>);
        }

        return summary;
    }

    /**
     * Returns an extracted information on a PO's vendor information in the form of Array of formatted JSX objects
     */
    getVendorInfo() {
        let { vendor } = this.props.details;
        let { keys } = this.props;
        let info = [];

        if (vendor) {
            info.push(<View key={1} style={styles.priceSumRow}>
                <Text style={[styles.priceSumKeys, { fontSize: fontSize.regular + 4 }]}>{vendor[keys['vendor']]}</Text>
            </View>);
            info.push(<View key={2} style={styles.priceSumRow}>
                <Text style={styles.priceSumData}>{vendor[keys['vAdd1']]}</Text>
            </View>);
            info.push(<View key={3} style={styles.priceSumRow}>
                <Text style={styles.priceSumData}>{vendor[keys['vAdd2']]}</Text>
            </View>);
            info.push(<View key={4} style={styles.priceSumRow}>
                <Text style={styles.priceSumData}>{vendor[keys['vAdd3']]}</Text>
            </View>);
            info.push(<View key={5} style={[styles.priceSumRow, { flexDirection: 'row' }]}>
                <Text style={[styles.priceSumKeys, { flex: 0.5 }]}>{"Phone:"}</Text>
                <Text onPress={() => vendor[keys['vPhone']] !== "" ? Linking.openURL("tel:" + vendor[keys['vPhone']]) : null} style={[styles.priceSumData, vendor[keys['vPhone']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]}>
                    {vendor[keys['vPhone']] === "" ? "-" : vendor[keys['vPhone']]}
                </Text>
            </View>);
            info.push(<View key={6} style={[styles.priceSumRow, { flexDirection: 'row' }]}>
                <Text style={[styles.priceSumKeys, { flex: 0.5 }]}>{"Fax:"}</Text>
                <Text style={styles.priceSumData}>{vendor[keys['vFax']] === "" ? "-" : vendor[keys['vFax']]}</Text>
            </View>);
            info.push(<View key={7} style={[styles.priceSumRow, { flexDirection: 'row' }]}>
                <Text style={[styles.priceSumKeys, { flex: 0.5 }]}>{"Email:"}</Text>
                <Text onPress={() => vendor[keys['vMail']] !== "" ? Linking.openURL("mailto:" + vendor[keys['vMail']]) : null} style={[styles.priceSumData, vendor[keys['vMail']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]}>
                    {vendor[keys['vMail']] === "" ? "-" : vendor[keys['vMail']]}
                </Text>
            </View>);
            info.push(<View key={8} style={[styles.priceSumRow, { flexDirection: 'row' }]}>
                <Text style={[styles.priceSumKeys, { flex: 0.5 }]}>{"Website:"}</Text>
                <Text onPress={() => vendor[keys['vSite']] !== "" ? Linking.openURL("http://" + vendor[keys['vSite']]) : null} style={[styles.priceSumData, vendor[keys['vSite']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]}>
                    {vendor[keys['vSite']] === "" ? "-" : vendor[keys['vSite']]}
                </Text>
            </View>);
        }

        return info;
    }

    /**
     * Returns an extracted information on a PO's sales information in the form of Array of formatted JSX objects
     */
    getSalesInfo() {
        let { sales } = this.props.details;
        let { keys } = this.props;
        let info = [];

        if (sales) {
            info.push(<View key={1} style={styles.priceSumRow}>
                <Text style={[styles.priceSumKeys, { fontSize: fontSize.regular + 4 }]}>{sales[keys['sales']]}</Text>
            </View>);
            info.push(<View key={2} style={[styles.priceSumRow, { flexDirection: 'row' }]}>
                <Text style={[styles.priceSumKeys, { flex: 0.5 }]}>{"Phone:"}</Text>
                <Text onPress={() => sales[keys['sPhone']] !== "" ? Linking.openURL("tel:" + sales[keys['sPhone']]) : null} style={[styles.priceSumData, sales[keys['sPhone']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]}>
                    {sales[keys['sPhone']] === "" ? "-" : sales[keys['sPhone']]}
                </Text>
            </View>);
            info.push(<View key={3} style={[styles.priceSumRow, { flexDirection: 'row' }]}>
                <Text style={[styles.priceSumKeys, { flex: 0.5 }]}>{"Mobile 1:"}</Text>
                <Text onPress={() => sales[keys['sMob1']] !== "" ? Linking.openURL("tel:" + sales[keys['sMob1']]) : null} style={[styles.priceSumData, sales[keys['sMob1']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]}>
                    {sales[keys['sMob1']] === "" ? "-" : sales[keys['sMob1']]}
                </Text>
            </View>);
            info.push(<View key={4} style={[styles.priceSumRow, { flexDirection: 'row' }]}>
                <Text style={[styles.priceSumKeys, { flex: 0.5 }]}>{"Mobile 2:"}</Text>
                <Text onPress={() => sales[keys['sMob2']] !== "" ? Linking.openURL("tel:" + sales[keys['sMob2']]) : null} style={[styles.priceSumData, sales[keys['sMob2']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]}>
                    {sales[keys['sMob2']] === "" ? "-" : sales[keys['sMob2']]}
                </Text>
            </View>);
            info.push(<View key={5} style={[styles.priceSumRow, { flexDirection: 'row' }]}>
                <Text style={[styles.priceSumKeys, { flex: 0.5 }]}>{"Email 1:"}</Text>
                <Text onPress={() => sales[keys['sMail1']] !== "" ? Linking.openURL("mailto:" + sales[keys['sMail1']]) : null} style={[styles.priceSumData, sales[keys['sMail1']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]} >
                    {sales[keys['sMail1']] === "" ? "-" : sales[keys['sMail1']]}
                </Text>
            </View>);
            info.push(<View key={6} style={[styles.priceSumRow, { flexDirection: 'row' }]}>
                <Text style={[styles.priceSumKeys, { flex: 0.5 }]}>{"Email 2:"}</Text>
                <Text onPress={() => sales[keys['sMail2']] !== "" ? Linking.openURL("mailto:" + sales[keys['sMail2']]) : null} style={[styles.priceSumData, sales[keys['sMail2']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]} >
                    {sales[keys['sMail2']] === "" ? "-" : sales[keys['sMail2']]}
                </Text>
            </View>);
        }

        return info;
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
                                <Text onPress={() => this.setState({ vendorDetails: true })} style={[styles.textStyle, { color: color.light_blue, textDecorationLine: 'underline' }]}>
                                    {header[keys['vendor']]}
                                </Text>
                            </View>
                            <View style={styles.subRequestHead}>
                                <Text style={styles.titleTextStyle}>{"Created By:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['requestor']]}</Text>
                                <Text style={styles.titleTextStyle}>{"Max Receive Date:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['maxDate']]}</Text>
                                <Text style={styles.titleTextStyle}>{"Sales:"}</Text>
                                <Text onPress={() => this.setState({ salesDetails: true })} style={[styles.textStyle, { color: color.light_blue, textDecorationLine: 'underline' }]}>
                                    {details.sales[keys['sales']]}
                                </Text>
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
                            <Text style={styles.textStyle}>{"Rp. " + item[keys['uPrice']].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Unit Discount:"}</Text>
                            <Text style={styles.textStyle}>{"Rp. " + item[keys['uDisc']].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Net Amount:"}</Text>
                            <Text style={styles.textStyle}>{"Rp. " + item[keys['iNet']].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
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
        let priceModal, vendorModal, salesModal;
        if (this.props.detailsReceived) {
            priceModal = (<DialogBoxModal
                visible={this.state.priceSummary}
                title={"Price Summary: "}
                height={0.65}
                content={this.getPriceSummary()}
                buttons={[{ text: "OK", onPress: () => this.setState({ priceSummary: false }) }]}
            />);
            vendorModal = (<DialogBoxModal
                visible={this.state.vendorDetails}
                title={"Vendor Details: "}
                content={this.getVendorInfo()}
                buttons={[{ text: "OK", onPress: () => this.setState({ vendorDetails: false }) }]}
            />);
            salesModal = (<DialogBoxModal
                visible={this.state.salesDetails}
                title={"Sales Details: "}
                content={this.getSalesInfo()}
                buttons={[{ text: "OK", onPress: () => this.setState({ salesDetails: false }) }]}
            />);
        }

        return (
            <View style={styles.container}>
                {priceModal}
                {vendorModal}
                {salesModal}
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