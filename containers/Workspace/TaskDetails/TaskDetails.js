import React from 'react';
import { Button } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    View, Alert, Text,
    ScrollView, ActivityIndicator,
    Linking, Platform
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';

import styles from "./styles";
import * as workspaceAction from '../../../actions/workspaceActions';
import PageHeader from '../../../components/Header';
import IconWrapper from '../../../components/IconWrapper';
import PickerWrapper from '../../../components/PickerWrapper';
import DialogBoxModal from '../../../components/DialogBoxModal';
import { color, normalize, fontSize, fontFamily } from '../../../theme/baseTheme';
import { img } from '../../../assets/images';

//Maps reducer's states to TaskDetails props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    detailsReceived: state.workspaceReducer.detailsReceived,
    details: state.workspaceReducer.details,
});

//Maps actions to TaskDetails props
export const mapDispatchToProps = (dispatch) => ({
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
});

class TaskDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchStatus: null,
            custDialog: false,
            custDetails: null,
            itemActions: [],
            staffDialog: false,
            staffDetails: null,
            location: null
        };

        this.onPickerSelect = this.onPickerSelect.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onFetchFinish = this.onFetchFinish.bind(this);
        this.finalizeTask = this.finalizeTask.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this.props.actionsWorkspace.getStaffDetails(this.props.header.staff, (status, staffDetails) => status === 'success' && this.mounted ? this.setState({ staffDetails }) : console.log(status));
        this.props.actionsWorkspace.getDOCustDetails(this.props.DONo, this.props.token, this.onFetchFinish);
        this.props.actionsWorkspace.getCustfromTicket(this.props.token, this.props.header['ticket_number'], (status, custDetails) => status === 'success' && this.mounted ? this.setState({ custDetails }) : console.log(status));
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    /**
     * Callback to be called when fetching process done
     * @param {String} status: Fetch status response (directly related to HTTP status code response)
     */
    onFetchFinish(status) {
        if (status === 401)
            Actions.reset('Main')   //go back to workspace and workspace will logout
        else if (this.mounted && status === "success")
            this.setState({ fetchStatus: status });
        else if (this.mounted && status === "no DONo")
            this.setState({ fetchStatus: status })
        else {                      //in case data was stale and need refreshing to sync with current DB
            Alert.alert(status);
            this.props.refresh();
            setTimeout(() => Actions.pop(), 300);
        }
    }

    /**
     * When user picks an item from the drop down boxes
     * @param {String} itemPieceNo: Affected item's piece number 
     * @param {String} itemCode: Affected item's code 
     * @param {String} status: Affected item's status (one of the statusCodes in DBkeys.json) 
     * @param {String} action: picked action on this item (one of the actions in DBkeys.json) 
     */
    onPickerSelect(itemPieceNo, itemCode, status, action) {
        let temp = this.state.itemActions,
            statusItem = this.props.keys.actions[action];

        //replace existing value
        let index = temp.findIndex((item) => item['itemPieceNo'] === itemPieceNo)
        if (index > -1)
            temp.splice(index, 1);

        temp.push({ itemPieceNo, itemCode, status, statusItem });
        this.setState({ itemActions: temp });
    }

    /**
     * Asynchronous function to get current location of the device
     */
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'You have to give permission to access location before proceeding\nGo to your phone setting to change permission settings');
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
        return Promise.resolve(location)
    };

    /**
     * Save the recorded selected actions on the items in the list
     */
    onSave() {
        /***** Collect user's location data *****/
        if (Platform.OS === 'android' && !Constants.isDevice) {
            Alert.alert('Emulator Detected', 'This feature only works on devices');
        } else {
            this._getLocationAsync().then((location) => this.finalizeTask(location));
        }
    }

    /**
     * Record user's input together with the location retrieved from _getLocationAsync()
     */
    finalizeTask(location) {
        /***** Collect input data user has selected *****/
        let itemPieceNo = "", itemCode = "", status = "", statusItem = "";
        //set default verification to "Arrived" for the rest of the items
        this.props.details.Items.forEach((element) => {
            if (this.state.itemActions.findIndex((item) => item['itemPieceNo'] === element[this.props.keys['piece']]) === -1) {
                itemPieceNo += element[this.props.keys['piece']] + ",";
                itemCode += element[this.props.keys['code']] + ",";
                status += element[this.props.keys['itemStatus']] + ",";
                statusItem += (1 + ",");
            }
        })
        //turn into individual strings
        this.state.itemActions.forEach((element) => {
            itemPieceNo += element['itemPieceNo'] + ",";
            itemCode += element['itemCode'] + ",";
            status += element['status'] + ",";
            statusItem += element['statusItem'] + ",";
        });
        //remove last comma
        itemPieceNo = itemPieceNo.substr(0, itemPieceNo.length - 1);
        itemCode = itemCode.substr(0, itemCode.length - 1);
        status = status.substr(0, status.length - 1);
        statusItem = statusItem.substr(0, statusItem.length - 1);

        /***** Double Check with user before finalizing action *****/
        Alert.alert('Save changes to DO Details?', "Are you sure you want to SAVE the Actions on these items?", [
            { text: 'Cancel', onPress: () => console.log('Save Cancelled'), style: 'cancel' },
            {
                text: 'Save', onPress: () =>
                    this.props.actionsWorkspace.confirmDOCustomer(this.props.token,
                        this.props.header[this.props.keys['no']],
                        itemPieceNo, itemCode, status, statusItem,
                        (title, msg) =>
                            Alert.alert(title, msg, [
                                {
                                    text: 'OK', onPress: () => {
                                        this.props.refresh();
                                        setTimeout(() => Actions.pop(), 300);
                                    }
                                }
                            ])
                    )
            }
        ]);
    }

    /**
     * Build customer information modal content
     * @param Customer: customer info to be rendered
     */
    getCustomerInfo(Customer) {
        let { keys } = this.props;
        let info = [];

        if (Customer) {
            info.push(<View key={1} style={styles.modalRow}>
                <Text style={[styles.modalData, { fontSize: fontSize.regular + 4 }]}>{Customer[keys['cust']]}</Text>
            </View>);
            info.push(<View key={2} style={styles.modalRow}>
                <Text style={[styles.modalData, { fontFamily: fontFamily.boldItalic }]}>{"ID: " + Customer[keys['custID']]}</Text>
            </View>);
            if (Customer[keys['add1']] !== '' && Customer[keys['add1']] !== null)
                info.push(<View key={3} style={styles.modalRow}>
                    <Text style={[styles.modalData, { fontFamily: fontFamily.medium }]}>{Customer[keys['add1']]}</Text>
                </View>);
            if (Customer[keys['add2']] !== '' && Customer[keys['add2']] !== null)
                info.push(<View key={4} style={styles.modalRow}>
                    <Text style={[styles.modalData, { fontFamily: fontFamily.medium }]}>{Customer[keys['add2']]}</Text>
                </View>);
            if (Customer[keys['add3']] !== '' && Customer[keys['add3']] !== null)
                info.push(<View key={5} style={styles.modalRow}>
                    <Text style={[styles.modalData, { fontFamily: fontFamily.medium }]}>{Customer[keys['add3']]}</Text>
                </View>);
            if (Customer[keys['city']] !== '' && Customer[keys['city']] !== null)
                info.push(<View key={6} style={styles.modalRow}>
                    <Text style={[styles.modalData, { fontFamily: fontFamily.medium }]}>{Customer[keys['city']]}</Text>
                </View>);
            if (Customer[keys['country']] !== '' && Customer[keys['country']] !== null)
                info.push(<View key={7} style={styles.modalRow}>
                    <Text style={[styles.modalData, { fontFamily: fontFamily.medium }]}>{Customer[keys['country']]}</Text>
                </View>);
            if (Customer[keys['zip']] !== '' && Customer[keys['zip']] !== null)
                info.push(<View key={8} style={styles.modalRow}>
                    <Text style={[styles.modalData, { fontFamily: fontFamily.medium }]}>{Customer[keys['zip']]}</Text>
                </View>);
            info.push(<View key={9} style={[styles.modalRow, { flexDirection: 'row' }]}>
                <Text style={[styles.modalKeys, { flex: 0.5 }]}>{"Username:"}</Text>
                <Text style={styles.modalData}>{Customer[keys['uName']]}</Text>
            </View>);
            info.push(<View key={10} style={[styles.modalRow, { flexDirection: 'row' }]}>
                <Text style={[styles.modalKeys, { flex: 0.5 }]}>{"Service:"}</Text>
                <Text style={styles.modalData}>{Customer[keys['service']]}</Text>
            </View>);
            info.push(<View key={11} style={[styles.modalRow, { flexDirection: 'row' }]}>
                <Text style={[styles.modalKeys, { flex: 0.5 }]}>{"Phone:"}</Text>
                <Text onPress={() => Customer[keys['tel1']] !== "" ? Linking.openURL("tel:" + Customer[keys['tel1']]) : null} style={[styles.modalData, Customer[keys['tel1']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]}>
                    {Customer[keys['tel1']] === "" ? "-" : Customer[keys['tel1']]}
                </Text>
            </View>);
            info.push(<View key={12} style={[styles.modalRow, { flexDirection: 'row' }]}>
                <Text style={[styles.modalKeys, { flex: 0.5 }]}>{"Phone2:"}</Text>
                <Text onPress={() => Customer[keys['tel2']] !== "" ? Linking.openURL("tel:" + Customer[keys['tel2']]) : null} style={[styles.modalData, Customer[keys['tel2']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]}>
                    {Customer[keys['tel2']] === "" ? "-" : Customer[keys['tel2']]}
                </Text>
            </View>);
        }

        return info;
    }

    /**
     * Build staff info modal content
     */
    getStaffInfo() {
        let { staffDetails } = this.state;
        let { keys, header } = this.props;
        let info = [];

        if (staffDetails) {
            info.push(<View key={1} style={styles.modalRow}>
                <Text style={[styles.modalData, { fontSize: fontSize.regular + 4 }]}>{staffDetails[keys['staff']]}</Text>
            </View>);
            info.push(<View key={2} style={styles.modalRow}>
                <Text style={[styles.modalData, { fontFamily: fontFamily.boldItalic }]}>{staffDetails[keys['division']]}</Text>
            </View>);
            info.push(<View key={3} style={styles.modalRow}>
                <Text style={[styles.modalData, { fontFamily: fontFamily.boldItalic, fontSize: fontSize.small }]}>{`ID: ${header[keys['picID']]}`}</Text>
            </View>);
            info.push(<View key={4} style={[styles.modalRow, { flexDirection: 'row' }]}>
                <Text style={[styles.modalKeys, { flex: 0.4 }]}>{"Ext: "}</Text>
                <Text style={styles.modalData}>
                    {staffDetails[keys['ext']] === "" ? "-" : staffDetails[keys['ext']]}
                </Text>
            </View>);
            info.push(<View key={5} style={[styles.modalRow, { flexDirection: 'row' }]}>
                <Text style={[styles.modalKeys, { flex: 0.4 }]}>{"Email 1: "}</Text>
                <Text onPress={() => staffDetails[keys['sMail1']] !== "" ? Linking.openURL("mailto:" + staffDetails[keys['sMail1']]) : null} style={[styles.modalData, staffDetails[keys['sMail1']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]}>
                    {staffDetails[keys['sMail1']] === "" ? "-" : staffDetails[keys['sMail1']]}
                </Text>
            </View>);
            info.push(<View key={6} style={[styles.modalRow, { flexDirection: 'row' }]}>
                <Text style={[styles.modalKeys, { flex: 0.4 }]}>{"Email 2: "}</Text>
                <Text onPress={() => staffDetails[keys['sMail2']] !== "" ? Linking.openURL("mailto:" + staffDetails[keys['sMail2']]) : null} style={[styles.modalData, staffDetails[keys['sMail2']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]}>
                    {staffDetails[keys['sMail2']] === "" ? "-" : staffDetails[keys['sMail2']]}
                </Text>
            </View>);
            info.push(<View key={7} style={[styles.modalRow, { flexDirection: 'row' }]}>
                <Text style={[styles.modalKeys, { flex: 0.4 }]}>{"Phone 1: "}</Text>
                <Text onPress={() => staffDetails[keys['phone1']] !== "" ? Linking.openURL("tel:" + staffDetails[keys['phone1']]) : null} style={[styles.modalData, staffDetails[keys['phone1']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]}>
                    {staffDetails[keys['phone1']] === "" ? "-" : staffDetails[keys['phone1']]}
                </Text>
            </View>);
            info.push(<View key={8} style={[styles.modalRow, { flexDirection: 'row' }]}>
                <Text style={[styles.modalKeys, { flex: 0.4 }]}>{"Phone 2: "}</Text>
                <Text onPress={() => staffDetails[keys['phone2']] !== "" ? Linking.openURL("tel:" + staffDetails[keys['phone2']]) : null} style={[styles.modalData, staffDetails[keys['phone2']] !== "" ? { color: color.light_blue, textDecorationLine: 'underline' } : null]}>
                    {staffDetails[keys['phone2']] === "" ? "-" : staffDetails[keys['phone2']]}
                </Text>
            </View>);
        }

        return info;
    }

    /**
     * Render complete DO form with the help of renderItems to render individual panels for items
     */
    renderDO() {
        let { header, keys, details } = this.props;
        let date = new Date(header[keys['date']].replace(/\./g, '-')).toString().split(' ');
        return (
            <ScrollView>
                <View style={styles.requestHead}>
                    <View style={{ flex: 0.12, alignItems: 'center', justifyContent: 'center', margin: normalize(1), borderRadius: 6, backgroundColor: img.taskCategory[header[keys['category']]].color }}>
                        <Text style={[styles.textStyle, { flex: 0, margin: 0, fontSize: normalize(18), color: color.white }]}>
                            {header[keys['category']]}
                        </Text>
                    </View>
                    <View style={styles.horizontalSubRequestHead}>
                        <View style={styles.verticalSubRequestHead}>
                            <View style={{ flex: 1.5 }}>
                                <Text style={styles.titleTextStyle}>{"Nomor Tiket:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['ticket']]}</Text>
                                <Text style={styles.titleTextStyle}>{"Tanggal Pergi:"}</Text>
                                <Text style={styles.textStyle}>{`${date[2]} ${date[1]} ${date[3]}`}</Text>
                                <Text style={styles.titleTextStyle}>{"Jam Pergi:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['time']]}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.titleTextStyle, { flex: 0 }]}>{"Keperluan:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['needs']]}</Text>
                            </View>
                        </View>
                        <View style={styles.verticalSubRequestHead}>
                            <View style={{ flex: 1.5 }}>
                                <Text style={styles.titleTextStyle}>{"Lokasi:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['location']]}</Text>
                                <Text style={styles.titleTextStyle}>{"PIC Staff:"}</Text>
                                <Text onPress={() => this.setState({ staffDialog: true })} style={[styles.textStyle, { color: color.light_blue, textDecorationLine: 'underline' }]}>
                                    {header[keys['pic']]}
                                </Text>
                                <Text style={styles.titleTextStyle}>{"Customer:"}</Text>
                                {this.state.custDetails ?
                                    <Text onPress={() => this.setState({ custDialog: true })} style={[styles.textStyle, { color: color.light_blue, textDecorationLine: 'underline' }]}>
                                        {this.state.custDetails[keys['cust']]}
                                    </Text>
                                    :
                                    <Text onPress={() => this.setState({ custDialog: true })} style={[styles.textStyle, { color: color.light_blue, textDecorationLine: 'underline' }]}>
                                        {this.props.detailsReceived ? details.Customer[keys['cust']] : null}
                                    </Text>
                                }
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.titleTextStyle, { flex: 0 }]}>{"Catatan:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['note']]}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {
                    this.state.fetchStatus ?
                        <View style={styles.requestBody}>
                            {
                                this.props.detailsReceived ?
                                    this.renderItems(this.props.details.Items)
                                    :
                                    <View style={{ flex: 1, alignItems: 'center', height: normalize(50) }}>
                                        <Text style={[styles.textStyle, { marginTop: normalize(15), textAlign: 'center', fontSize: normalize(16) }]}> Perangkat tidak terdaftar di WAMS </Text>
                                    </View>}
                        </View>
                        :
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <ActivityIndicator animating={true} size='large' />
                        </View>
                }
            </ScrollView>);
    }

    /**
     * Render out the items by iterating through the list of items
     * @param {Array} DOItems List of items in the DO
     */
    renderItems(DOItems) {
        let { keys } = this.props;

        let items = DOItems.map((item, key) => {
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
                            <Text style={styles.titleTextStyle}>{"Serial No.:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['serial']]}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Item Piece No.:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['piece']]}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Amount"}</Text>
                            <Text style={styles.textStyle}>{item[keys['amount']]}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Status:"}</Text>
                            <Text style={styles.textStyle}>{keys.statusCode[item[keys['itemStatus']]]}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Action:"}</Text>
                            <PickerWrapper items={keys.actions.list} style={{ flex: 2, marginLeft: normalize(8) }} onSelect={(action) => this.onPickerSelect(item[keys['piece']], item[keys['code']], item[keys['itemStatus']], action)} />
                        </View>
                    </View>
                </View>
            );
        });

        return items;
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.custDetails ?
                    <DialogBoxModal
                        visible={this.state.custDialog}
                        title={"Customer Details: "}
                        height={0.6}
                        content={this.getCustomerInfo(this.state.custDetails)}
                        buttons={[{ text: "OK", onPress: () => this.setState({ custDialog: false }) }]}
                    />
                    : this.props.detailsReceived ?
                        <DialogBoxModal
                            visible={this.state.custDialog}
                            title={"Customer Details: "}
                            height={0.6}
                            content={this.getCustomerInfo(this.props.details.Customer)}
                            buttons={[{ text: "OK", onPress: () => this.setState({ custDialog: false }) }]}
                        /> : null}
                {this.state.staffDetails ?
                    <DialogBoxModal
                        visible={this.state.staffDialog}
                        title={"Staff Details: "}
                        content={this.getStaffInfo()}
                        buttons={[{ text: "OK", onPress: () => this.setState({ staffDialog: false }) }]}
                    />
                    : null}
                < PageHeader
                    left={<IconWrapper name='chevron-left' type='font-awesome' color='white' size={28} style={styles.icon} onPress={() => Actions.pop()} />}
                    title={'Task Details'}
                    right={<View style={{ width: 38 }} />} />
                <View style={styles.bodyContainer}>
                    {this.renderDO()}
                </View>
                {this.props.DONo ?
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            <Button
                                raised
                                borderRadius={8}
                                title={'SAVE'}
                                backgroundColor={color.blue}
                                textStyle={styles.buttonText}
                                onPress={this.onSave} />
                        </View>
                    </View> :
                    null
                }

            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetails);