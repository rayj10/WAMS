import React from 'react';
import { Button } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    View, Alert, Text,
    ScrollView, ActivityIndicator,
    Linking
} from 'react-native';

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
            custDetails: false,
            itemActions: [],
        };

        this.onPickerSelect = this.onPickerSelect.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onFetchFinish = this.onFetchFinish.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        if (this.props.DONo)
            this.props.actionsWorkspace.getDOCustDetails(this.props.DONo, this.props.token, this.onFetchFinish);
        else
            this.setState({ fetchStatus: 'none' });
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
     * Build customer information modal content
     */
    getCustomerInfo() {
        let { Customer } = this.props.details;
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
        let { header, keys } = this.props;
        let date = new Date(header[keys['date']].replace(/\./g, '-')).toString().split(' ');
        return (
            <ScrollView>
                <View style={styles.requestHead}>
                    <View style={{ flex: 0.15, alignItems: 'center', justifyContent: 'center', margin: normalize(1), borderRadius: 6, backgroundColor: img.taskCategory[header[keys['category']]].color }}>
                        <Text style={[styles.textStyle, { flex: 0, margin: 0, fontSize: normalize(18), color: color.white }]}>
                            {header[keys['category']]}
                        </Text>
                    </View>
                    <View style={styles.horizontalSubRequestHead}>
                        <View style={styles.verticalSubRequestHead}>
                            <View style={{ flex: 1 }}>
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
                            <View style={{ flex: 1 }}>
                                <Text style={styles.titleTextStyle}>{"PIC Staff:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['pic']]}</Text>
                                <Text style={styles.titleTextStyle}>{"Customer:"}</Text>
                                <Text onPress={() => this.setState({ custDetails: true })} style={[styles.textStyle, { color: color.light_blue, textDecorationLine: 'underline' }]}>
                                    {this.state.detailsReceived ? details.Customer[keys['cust']] : null}
                                </Text>
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
                                this.state.detailsReceived ?
                                    this.renderItems(this.props.details.Items)
                                    :
                                    <View style={{ flex: 1, alignItems: 'center', height: normalize(50) }}>
                                        <Text style={[styles.textStyle, { marginTop: normalize(15), textAlign: 'center', fontSize: normalize(16) }]}> No Items Listed </Text>
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
                {this.props.detailsReceived ?
                    <DialogBoxModal
                        visible={this.state.custDetails}
                        height={0.6}
                        title={"Customer Details: "}
                        content={this.getCustomerInfo()}
                        buttons={[{ text: "OK", onPress: () => this.setState({ custDetails: false }) }]}
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