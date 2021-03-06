import React from 'react';
import { Button } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    View, Alert, Text,
    ScrollView, ActivityIndicator
} from 'react-native';

import styles from "./styles";
import * as workspaceAction from '../../../actions/workspaceActions';
import PageHeader from '../../../components/Header';
import IconWrapper from '../../../components/IconWrapper';
import PickerWrapper from '../../../components/PickerWrapper';
import { color, normalize } from '../../../theme/baseTheme';
import { img } from '../../../assets/images';

//Maps reducer's states to TransferDetail's props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    detailsReceived: state.workspaceReducer.detailsReceived,
    details: state.workspaceReducer.details
});

//Maps actions to TransferDetail's props
export const mapDispatchToProps = (dispatch) => ({
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
});

class TransferDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchStatus: null,
            verifications: [],
            origin: null,
            target: null
        };

        this.onPickerSelect = this.onPickerSelect.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onDeny = this.onDeny.bind(this);
        this.onFetchFinish = this.onFetchFinish.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this.props.actionsWorkspace.getCheckTransferItem(this.props.token, this.props.header[this.props.keys['no']], (msg, origin, target) => {
            if (this.mounted && msg === 'success')
                this.setState({ origin, target });
        });
        this.props.actionsWorkspace.getTransferDetails(this.props.header[this.props.keys['no']], this.props.token, this.onFetchFinish);
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
     * Callback sent to picker element, executed when user changes the picker value
     * make a pairing of itemPieceNo and verification, then add it to state
     * @param {String} itemPieceNo: piece number of the item to be confirmed
     * @param {String} verification: verification status of the item 
     */
    onPickerSelect(itemPieceNo, verification) {
        let temp = this.state.verifications,
            verID = 1;

        if (verification === 'Missed')
            verID = 0;

        //replace existing value
        let index = temp.findIndex((item) => item['itemPieceNo'] === itemPieceNo)
        if (index > -1)
            temp.splice(index, 1);

        temp.push({ itemPieceNo, verID });
        this.setState({ verifications: temp });
    }

    /**
     * On Transfer Confirm, add default values for item piece no that has not been updated with new picker value
     * Then post the values to API
     */
    onConfirm() {
        let itemPieceNo = "", verification = "";

        //set default verification to "Arrived" for the rest of the items
        this.props.details.forEach((element) => {
            if (this.state.verifications.findIndex((item) => item['itemPieceNo'] === element[this.props.keys['piece']]) === -1) {
                itemPieceNo += element[this.props.keys['piece']] + ",";
                verification += (1 + ",");
            }
        })

        //turn into individual strings
        this.state.verifications.forEach((element) => {
            itemPieceNo += element['itemPieceNo'] + ",";
            verification += element['verID'] + ",";
        });

        //remove last comma
        itemPieceNo = itemPieceNo.substr(0, itemPieceNo.length - 1);
        verification = verification.substr(0, verification.length - 1);

        Alert.alert('Confirm Transfer Request', "Are you sure you want to CONFIRM this transfer request?", [
            { text: 'Cancel', onPress: () => console.log('Transfer Confirmation Cancelled'), style: 'cancel' },
            {
                text: 'Confirm', onPress: () =>
                    this.props.actionsWorkspace.confirmTransferDetails(this.props.token,
                        this.props.header[this.props.keys['no']],
                        this.state.origin, this.state.target,
                        itemPieceNo, verification, (title, msg) =>
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
     * On Transfer Deny, post the information to API
     */
    onDeny() {
        Alert.alert('Deny Transfer Request', "Are you sure you want to DENY this transfer request?", [
            { text: 'Cancel', onPress: () => console.log('Transfer Denial Cancelled'), style: 'cancel' },
            {
                text: 'Deny', onPress: () =>
                    this.props.actionsWorkspace.denyTransferDetails(this.props.token,
                        this.props.header[this.props.keys['no']],
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
     * Render complete request form with the help of renderItems to render individual panels for items
     */
    renderTransfer() {
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
                                    <Text style={styles.titleTextStyle}>{"Transfer No.:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['no']]}</Text>
                                    <Text style={styles.titleTextStyle}>{"Request Date:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['date']]}</Text>
                                    <Text style={styles.titleTextStyle}>{"Origin Location:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['from']]}</Text>
                                </View>
                                <View style={styles.verticalSubRequestHead}>
                                    <Text style={styles.titleTextStyle}>{"Transfer By:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['requestor']]}</Text>
                                    <Text style={styles.titleTextStyle}>{"Department:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['department']]}</Text>
                                    <Text style={styles.titleTextStyle}>{"Target Location:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['to']]}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.requestBody}>
                            {this.renderItems(details)}
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
     * @param {Array} requestItems List of items requested
     */
    renderItems(requestItems) {
        let { keys } = this.props;
        let lastLine = null;

        let items = requestItems.map((item, key) => {
            let status = item[keys['sCode']];

            if (this.props.caller === 'Approval')
                lastLine = (
                    <View style={styles.verticalSubPanel}>
                        <Text style={[styles.textStyle, { flex: 1, textAlign: 'right', marginLeft: 0 }]}>{"Verification:"}</Text>
                        <PickerWrapper items={['Arrived', 'Missed']} style={{ flex: 1.2, marginTop: normalize(3) }} onSelect={(verification) => this.onPickerSelect(item[keys['piece']], verification)} />
                    </View>
                );
            else if (this.props.caller === 'View')
                lastLine = (
                    <View style={styles.verticalSubPanel}>
                        <Text style={[styles.titleTextStyle, { textAlign: 'right', marginLeft: 0 }]}>{"Status:"}</Text>
                        <Text style={[styles.titleTextStyle, { marginLeft: 5 }]}>
                            {status}
                        </Text>
                    </View >
                );

            return (
                <View style={styles.itemPanel} key={key}>
                    <View style={styles.verticalSubPanel}>
                        <Text style={[styles.textStyle, { marginLeft: 1 }]}>{(key + 1) + ". " + item[keys['item']]}</Text>
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
                            <Text style={styles.titleTextStyle}>{"Mac Address:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['mac']]}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Item Piece No.:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['piece']]}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Amount:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['amount']]}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Unit Code:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['unit']]}</Text>
                        </View>
                    </View>
                    {lastLine}
                </View>
            );
        });

        return items;
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
                            title={'CONFIRM'}
                            backgroundColor={color.green}
                            textStyle={styles.buttonText}
                            onPress={this.onConfirm} />
                    </View>
                    <View style={styles.button}>
                        <Button
                            raised
                            borderRadius={8}
                            title={'DENY'}
                            backgroundColor={color.red}
                            textStyle={styles.buttonText}
                            onPress={this.onDeny} />
                    </View>
                </View>);
        }

        return (
            <View style={styles.container}>
                <PageHeader
                    left={<IconWrapper name='chevron-left' type='font-awesome' color='white' size={28} style={styles.icon} onPress={() => Actions.pop()} />}
                    title={'Transfer Details'}
                    right={<View style={{ width: normalize(38) }} />} />
                <View style={styles.bodyContainer}>
                    {this.renderTransfer()}
                </View>
                {buttons}
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransferDetails);