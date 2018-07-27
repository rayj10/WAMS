import React from 'react';
import { Button } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    View, Alert, Text,
    ScrollView, TouchableOpacity, ActivityIndicator
} from 'react-native';

import styles from "./styles";
import * as workspaceAction from '../../../actions/workspaceActions';
import PageHeader from '../../../components/Header';
import ForwardModal from '../../../components/ForwardModal';
import IconWrapper from '../../../components/IconWrapper';
import { color, normalize } from '../../../theme/baseTheme';
import RequestDeclineModal from '../../../components/RequestDeclineModal';
import errors from '../../../json/errors.json';
import { img } from '../../../assets/images';

//Maps reducer's states to RequestDetails props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    detailsReceived: state.workspaceReducer.detailsReceived,
    details: state.workspaceReducer.details,
    forwardListReceived: state.workspaceReducer.forwardListReceived,
    forwardList: state.workspaceReducer.forwardList
});

//Maps actions to RequestDetails props
export const mapDispatchToProps = (dispatch) => ({
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
});

class RequestDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forwardModal: false,
            currentForwardItem: null,
            fetchStatus: null,
            notes: "",
            declineModal: false
        };

        this.onApprove = this.onApprove.bind(this);
        this.onDecline = this.onDecline.bind(this);
        this.onFetchFinish = this.onFetchFinish.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this.props.actionsWorkspace.getRequestDetails(this.props.header[this.props.keys['no']], this.props.token, this.onFetchFinish);
        if (this.props.caller === 'Approval')
            this.props.actionsWorkspace.getForwardList(this.props.token);
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
     * Build forward list items to be displayed onto forward modal
     */
    getForwardList() {
        if (this.props.forwardListReceived)
            return this.props.forwardList.map((item, key) =>
                <TouchableOpacity key={key} onPress={() => this.setState({ currentForwardItem: { name: item['Name'], Ucode: item['Id'] } })}>
                    <View style={[styles.forwardListItem, this.state.currentForwardItem && this.state.currentForwardItem.name === item['Name'] ? styles.activeItem : {}]}>
                        <Text style={styles.forwardListText}>{item['Name']}</Text>
                    </View>
                </TouchableOpacity>);
        return [];
    }

    /**
     * Forward this request to the selected recipient
     */
    onForward() {
        this.setState({ forwardModal: false });   //close modal
        let recipient = this.state.currentForwardItem;

        //Timeout is workaround for react native modal problem
        setTimeout(() => {
            //Check if recipient has been picked before pressing forward
            if (recipient !== null) {
                let { name, Ucode } = recipient;
                Alert.alert('Forward Confirmation', 'You are about to forward to ' + name + '\n\nProceed?', [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    {
                        text: 'Proceed', onPress: () => {
                            this.props.actionsWorkspace.forwardRequest(this.props.token,
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
                Alert.alert('Oops!', 'You must pick a recipient before forwarding', [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'Pick a Recipient', onPress: () => this.setState({ forwardModal: true }) } //reopen modal
                ])
        }, 1200);

        this.setState({ currentForwardItem: null }); //un-highlight the last choice
    }

    /**
     * Approve this request form
     */
    onApprove() {
        Alert.alert('Approve Request', "Are you sure to APPROVE this request?", [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            {
                text: 'Approve', onPress: () => {
                    this.props.actionsWorkspace.verifyRequest(this.props.token,
                        this.props.header[this.props.keys['no']],
                        'A',
                        (status, title, msg) => {
                            if (status === 'success')
                                Alert.alert(title, msg, [
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
            }]);
    }

    /**
     * Decline request form with the attached reasoning note from request decline modal
     */
    onDecline() {
        this.props.actionsWorkspace.verifyRequest(this.props.token,
            this.props.header[this.props.keys['no']],
            'R',
            (status, title, msg) => {
                if (status === 'success')
                    Alert.alert(title, msg, [
                        {
                            text: 'OK', onPress: () => {
                                this.props.refresh();
                                setTimeout(() => Actions.pop(), 300);
                            }
                        }
                    ]);
                else
                    Alert.alert(status);
            },
            this.state.notes
        );
        this.setState({ declineModal: false })
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
                            <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center', marginHorizontal: normalize(2), marginTop: normalize(2), borderRadius: 6, backgroundColor: img.formStatus[header[keys['status']]].color }}>
                                <Text style={[styles.textStyle, { marginLeft: 0, fontSize: normalize(18), color: color.white }]}>
                                    {header[keys['status']]}
                                </Text>
                            </View>
                            <View style={styles.horizontalSubRequestHead}>
                                <View style={styles.verticalSubRequestHead}>
                                    <Text style={styles.titleTextStyle}>{"Request No.:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['no']]}</Text>
                                    <Text style={styles.titleTextStyle}>{"Request Date:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['date']]}</Text>
                                </View>
                                <View style={styles.verticalSubRequestHead}>
                                    <Text style={styles.titleTextStyle}>{"Requestor:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['requestor']]}</Text>
                                    <Text style={styles.titleTextStyle}>{"Department:"}</Text>
                                    <Text style={styles.textStyle}>{header[keys['department']]}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.requestBody}>
                            {this.renderItems(details)}
                        </View>
                    </ScrollView >);
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

        return requestItems.map((item, key) => {
            return (
                <View style={styles.itemPanel} key={key}>
                    <View style={styles.verticalSubPanel}>
                        <Text style={[styles.textStyle, { marginLeft: 1 }]}>{(key + 1) + ". " + item[keys['item']]}</Text>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Amount:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['amount']] + " " + item[keys['unit']]}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Est. Price:"}</Text>
                            <Text style={styles.textStyle}>{"Rp." + item[keys['price']].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"From Warehouse:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['from']]}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Target Warehouse:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['to']]}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Target Receive Date:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['targetDate']].split("T")[0]}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Requested By:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['requestor']]}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <Text style={[styles.titleTextStyle, { textAlign: 'right', marginLeft: 0 }]}>{"Status:"}</Text>
                        <Text style={[styles.textStyle, { marginLeft: 5, flex: 1, color: img.itemStatus[item[keys['itemStatus']]].color }]}>
                            {item[keys['itemStatus']]}
                        </Text>
                    </View>
                </View>)
        });
    }

    render() {
        let buttons = null;
        let forwardIcon = <View style={{ width: normalize(38) }} />;
        let forwardModal = null;
        let declineModal = null;

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
                            title={'DECLINE'}
                            backgroundColor={color.red}
                            textStyle={styles.buttonText}
                            onPress={() => this.setState({ declineModal: true })} />
                    </View>
                </View>);
            forwardIcon = (<IconWrapper name='paper-plane' type='font-awesome' style={[styles.icon, { marginRight: 15 }]} color='white' size={24} onPress={() => this.setState({ forwardModal: true })} />);
            forwardModal = (
                <ForwardModal
                    visible={this.state.forwardModal}
                    forwardList={() => this.getForwardList()}
                    close={() => this.setState({ forwardModal: false, currentForwardItem: null })}
                    forward={() => this.onForward()} />);
            declineModal = (
                <RequestDeclineModal
                    visible={this.state.declineModal}
                    onChangeText={(text) => this.setState({ notes: text })}
                    value={this.state.notes}
                    close={() => { this.setState({ declineModal: false }) }}
                    decline={this.onDecline} />);
        }

        return (
            <View style={styles.container}>
                {forwardModal}
                {declineModal}
                <PageHeader
                    left={<IconWrapper name='chevron-left' type='font-awesome' color='white' size={28} style={styles.icon} onPress={() => Actions.pop()} />}
                    title={'Request Details'}
                    right={forwardIcon} />
                <View style={styles.bodyContainer}>
                    {this.renderRequest()}
                </View>
                {buttons}
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestDetails);