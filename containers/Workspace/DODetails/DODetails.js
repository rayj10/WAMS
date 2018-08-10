import React from 'react';
import { Button } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    View, Alert, Text,
    ScrollView, ActivityIndicator,
    TouchableOpacity, Linking
} from 'react-native';

import styles from "./styles";
import * as workspaceAction from '../../../actions/workspaceActions';
import PageHeader from '../../../components/Header';
import IconWrapper from '../../../components/IconWrapper';
import PickerWrapper from '../../../components/PickerWrapper';
import DialogBoxModal from '../../../components/DialogBoxModal';
import EditInstallerModal from '../../../components/EditInstallerModal';
import { color, normalize, fontSize, fontFamily } from '../../../theme/baseTheme';
import errors from '../../../json/errors.json';
import { img } from '../../../assets/images';

//Maps reducer's states to DODetails props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    detailsReceived: state.workspaceReducer.detailsReceived,
    details: state.workspaceReducer.details,
    installerListReceived: state.workspaceReducer.installerListReceived,
    installerList: state.workspaceReducer.installerList
});

//Maps actions to DODetails props
export const mapDispatchToProps = (dispatch) => ({
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
});

class DODetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchStatus: null,
            custDetails: false,
            selectedInstaller: null,
            editInstaller: false,
            itemActions: [],
        };

        this.onPickerSelect = this.onPickerSelect.bind(this);
        this.onSave = this.onSave.bind(this);
        this.changeInstaller = this.changeInstaller.bind(this);
        this.getInstallerList = this.getInstallerList.bind(this);
        this.onFetchFinish = this.onFetchFinish.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this.props.actionsWorkspace.getDOCustDetails(this.props.header[this.props.keys['no']], this.props.token, this.onFetchFinish);
        this.props.actionsWorkspace.getInstallerList(this.props.token, this.onFetchFinish);
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
     * Save the recorded selected actions on the items in the list
     */
    onSave() {
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
     * Build list of installers to be assigned with the list fetched from API
     */
    getInstallerList() {
        if (this.props.installerListReceived)
            return this.props.installerList.map((item, key) =>
                <TouchableOpacity key={key} onPress={() => this.setState({ selectedInstaller: { name: item['name'], Ucode: item['id'] } })}>
                    <View style={[styles.installerListItem, this.state.selectedInstaller && this.state.selectedInstaller.name === item['name'] ? styles.activeItem : {}]}>
                        <Text style={styles.installerListText}>{item['name']}</Text>
                    </View>
                </TouchableOpacity>);
        return [];
    }

    /**
     * Update the installer assigned to this DO Customer job
     */
    changeInstaller() {
        this.setState({ editInstaller: false });   //close modal
        let installer = this.state.selectedInstaller;

        //Timeout is workaround for react native modal problem
        setTimeout(() => {
            //Check if installer has been picked before pressing forward
            if (installer !== null) {
                let { name, Ucode } = installer;
                Alert.alert('Edit Confirmation', 'You are about to assign this task to ' + name + '\n\nProceed?', [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    {
                        text: 'Proceed', onPress: () => {
                            this.props.actionsWorkspace.updateInstaller(this.props.token,
                                this.props.header[this.props.keys['no']],
                                Ucode,
                                (status, title, msg) => {
                                    if (status === 'success')
                                        Alert.alert(title, msg + name, [
                                            {
                                                text: 'OK', onPress: () => {
                                                    this.props.refresh();
                                                    setTimeout(() => Actions.pop(), 300);
                                                }
                                            }
                                        ]);
                                    else
                                        Alert.alert(status);
                                }
                            );
                        }
                    }
                ]);
            }
            else
                Alert.alert('Oops!', 'You must pick an installer before saving', [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'Pick an Installer', onPress: () => this.setState({ editInstaller: true }) } //reopen modal
                ])
        }, 1200);

        this.setState({ selectedInstaller: null }); //un-highlight the last choice
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
            if (Customer[keys['add1']] !== '')
                info.push(<View key={3} style={styles.modalRow}>
                    <Text style={[styles.modalData, { fontFamily: fontFamily.medium }]}>{Customer[keys['add1']]}</Text>
                </View>);
            if (Customer[keys['add2']] !== '')
                info.push(<View key={4} style={styles.modalRow}>
                    <Text style={[styles.modalData, { fontFamily: fontFamily.medium }]}>{Customer[keys['add2']]}</Text>
                </View>);
            if (Customer[keys['add3']] !== '')
                info.push(<View key={5} style={styles.modalRow}>
                    <Text style={[styles.modalData, { fontFamily: fontFamily.medium }]}>{Customer[keys['add3']]}</Text>
                </View>);
            if (Customer[keys['city']] !== '')
                info.push(<View key={6} style={styles.modalRow}>
                    <Text style={[styles.modalData, { fontFamily: fontFamily.medium }]}>{Customer[keys['city']]}</Text>
                </View>);
            if (Customer[keys['country']] !== '')
                info.push(<View key={7} style={styles.modalRow}>
                    <Text style={[styles.modalData, { fontFamily: fontFamily.medium }]}>{Customer[keys['country']]}</Text>
                </View>);
            if (Customer[keys['zip']] !== '')
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
     * Render complete DO form with the help of renderItems to render individual panels for items
     */
    renderDO() {
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
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center', margin: normalize(1), borderRadius: 6, backgroundColor: img.formStatus[header[keys['status']]].color }}>
                                <Text style={[styles.textStyle, { flex: 0, margin: 0, fontSize: normalize(18), color: color.white }]}>
                                    {header[keys['status']]}
                                </Text>
                            </View>
                            <View style={styles.horizontalSubRequestHead}>
                                <View style={styles.verticalSubRequestHead}>
                                    <Text style={styles.titleTextStyle}>{"DO No.:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['no']]}</Text>
                                    <Text style={styles.titleTextStyle}>{"Giver :"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['giver']]}</Text>
                                    <Text style={styles.titleTextStyle}>{"Request Date:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['date']]}</Text>
                                </View>
                                <View style={styles.verticalSubRequestHead}>
                                    <Text style={styles.titleTextStyle}>{"Ticket No.:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['ticket']]}</Text>
                                    <Text style={styles.titleTextStyle}>{"Installer:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['installer']]}</Text>
                                    <Text style={styles.titleTextStyle}>{"Customer:"}</Text>
                                    <Text onPress={() => this.setState({ custDetails: true })} style={[styles.textStyle, { color: color.light_blue, textDecorationLine: 'underline' }]}>
                                        {details.Customer[keys['cust']]}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.requestBody}>
                            {this.renderItems(details.Items)}
                        </View>
                    </ScrollView>);
            }
            else {
                if (errors[status] === undefined)
                    status = 'Unknown Error';

                content = (
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.titleTextStyle, { textAlign: 'center', fontSize: 20 }]}>{'\n\n' + errors[status].name + '\n'}</Text>
                        <Text style={[styles.titleTextStyle, { textAlign: 'center', fontSize: 16 }]}>
                            {errors[status].message}
                        </Text>
                    </View>
                );
            }
        }
        return content;
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
                {this.props.detailsReceived ?
                    <DialogBoxModal
                        visible={this.state.custDetails}
                        height={0.6}
                        title={"Customer Details: "}
                        content={this.getCustomerInfo(this.props.details.Customer)}
                        buttons={[{ text: "OK", onPress: () => this.setState({ custDetails: false }) }]}
                    />
                    : null}
                <EditInstallerModal
                    visible={this.state.editInstaller}
                    installerList={this.getInstallerList}
                    close={() => this.setState({ editInstaller: false })}
                    save={this.changeInstaller}
                />
                < PageHeader
                    left={<IconWrapper name='chevron-left' type='font-awesome' color='white' size={28} style={styles.icon} onPress={() => Actions.pop()} />}
                    title={'DO Details'}
                    right={<IconWrapper name='person-pin-circle' color='white' size={28} style={styles.icon} onPress={() => this.setState({ editInstaller: true })} />} />
                <View style={styles.bodyContainer}>
                    {this.renderDO()}
                </View>
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
                </View>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DODetails);