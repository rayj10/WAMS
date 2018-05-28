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
import ForwardModal from '../../../components/ForwardModal';
import IconWrapper from '../../../components/IconWrapper';
import { color } from '../../../theme/baseTheme';

//Maps reducer's states to RequestDetails props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    isDetailsReceived: state.workspaceReducer.isDetailsReceived,
    requestHead: state.workspaceReducer.requestHead,
    requestDetails: state.workspaceReducer.requestDetails
});

//Maps actions to RequestDetails props
export const mapDispatchToProps = (dispatch) => ({
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
});

class RequestDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forwardRequest: false,
            currentForwardItem: null,
            fetchStatus: null
        };

        this.onApprove = this.onApprove.bind(this);
        this.onDecline = this.onDecline.bind(this);
        this.onFetchFinish = this.onFetchFinish.bind(this);
    }

    componentDidMount() {
        this.props.actionsWorkspace.getRequestDetails(this.props.request, this.props.token, this.onFetchFinish);
    }

    /**
     * Callback to be called when fetching process done
     * @param {String} status: Fetch status response (directly related to HTTP status code response)
     */
    onFetchFinish(status) {
        if (status === 'Authentication Denied')
            Actions.reset('Main')   //go back to workspace and workspace will logout
        else
            this.setState({ fetchStatus: status })
    }

    /**
     * Fetch list of recipients from API and display it to be selected from
     */
    getForwardList() {
        let list = ['Account 1', 'Account 2', 'Account 3', 'Account 4', 'Account 5', 'Account 6', 'Account 7', 'Account 8', 'Account 9', 'Account 10'];

        return list.map((item, key) =>
            <TouchableOpacity key={key} onPress={() => this.setState({ currentForwardItem: item })}>
                <View style={[styles.forwardListItem, this.state.currentForwardItem === item ? styles.activeItem : {}]}>
                    <Text style={styles.forwardListText}>{item}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    /**
     * What to do when forward button pressed
     */
    onForward() {
        this.setState({ forwardRequest: false });   //close modal
        let recipient = this.state.currentForwardItem;

        setTimeout(() => {
            if (recipient !== null)     //Check if recipient has been picked before pressing forward
                Alert.alert('Forward Confirmation', 'You are about to forward to ' + recipient + '\n\nProceed?', [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'Proceed', onPress: () => {/*this.props.actionsWorkspace.forwardRequest(currentForwardItem)*/ } }
                ]);
            else
                Alert.alert('Oops!', 'You must pick a recipient before forwarding', [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'Pick a Recipient', onPress: () => this.setState({ forwardRequest: true }) } //reopen modal
                ])
        }, 1000);

        this.setState({ currentForwardItem: null }); //un-highlight the last choice
    }

    /**
     * What to do when Request is approved
     */
    onApprove() {
        Alert.alert('Confirmation', "You are about to APPROVE an inventory request.\n\nAre you sure you want to approve this request?", [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'Approve', onPress: () => console.log('Approve Pressed') }, //call a function to interact with fetchAPI from actions.js
        ], )
    }

    /**
     * What to do when Request is declined
     */
    onDecline() {
        Alert.alert('Confirmation', "You are about to DECLINE an inventory request.\n\nAre you sure you want to decline this request?", [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'Decline', onPress: () => console.log('Decline Pressed') }, //call a function to interact with fetchAPI from actions.js
        ], )
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
            if (this.props.isDetailsReceived) {
                let request = this.props.requestHead;
                let details = this.props.requestDetails;
                content = (
                    <ScrollView>
                        <View style={styles.requestHead}>
                            <View style={styles.subRequestHead}>
                                <Text style={styles.titleTextStyle}>{"Request No.:"}</Text>
                                <Text style={styles.textStyle}>{request['RequestNo']}</Text>
                                <Text style={styles.titleTextStyle}>{"Request Date:"}</Text>
                                <Text style={styles.textStyle}>{request['RequestDate']}</Text>
                            </View>
                            <View style={styles.subRequestHead}>
                                <Text style={styles.titleTextStyle}>{"Requestor:"}</Text>
                                <Text style={styles.textStyle}>{request['full_nm']}</Text>
                                <Text style={styles.titleTextStyle}>{"Department:"}</Text>
                                <Text style={styles.textStyle}>{request['dept_nm']}</Text>
                            </View>
                        </View>
                        <View style={styles.requestBody}>
                            {this.renderItems(details)}
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
        return requestItems.map((item, key) => {

            //determine color code for status
            let statusColor = { color: '#3fd130' };
            let status = item["StatusName"];
            if (status === 'Reject' || status === 'Cancel')
                statusColor = { color: '#ff3030' }
            else if (status === 'Open')
                statusColor = { color: '#ffae19' }

            return (
                <View style={styles.itemPanel} key={key}>
                    <View style={styles.verticalSubPanel}>
                        <Text style={[styles.titleTextStyle, { marginLeft: 1 }]}>{(key + 1) + ". " + item['ItemName']}</Text>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Amount:"}</Text>
                            <Text style={styles.textStyle}>{item['AmountItem']}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Est. Price:"}</Text>
                            <Text style={styles.textStyle}>{"Rp." + item['EstimatedPrice']}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"From Warehouse:"}</Text>
                            <Text style={styles.textStyle}>{item['Origin']}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Target Warehouse:"}</Text>
                            <Text style={styles.textStyle}>{item['Target']}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Target Receive Date:"}</Text>
                            <Text style={styles.textStyle}>{item['TargetReceivedDate']}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Requested By:"}</Text>
                            <Text style={styles.textStyle}>{item['full_nm']}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <Text style={[styles.titleTextStyle, { textAlign: 'right', marginLeft: 0 }]}>{"Status:"}</Text>
                        <Text style={[styles.titleTextStyle, { marginLeft: 5 }, statusColor]}>{item['StatusName']}</Text>
                    </View>
                </View>)
        });
    }

    render() {
        let buttons = null;
        let forwardIcon = <View style={{ width: 34 }} />;
        let forwardModal = null;

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
                            onPress={this.onDecline} />
                    </View>
                </View>);
            forwardIcon = (<IconWrapper name='paper-plane' type='font-awesome' style={{ marginRight: 5 }} color='white' size={28} onPress={() => this.setState({ forwardRequest: true })} />);
            forwardModal = (
                <ForwardModal
                    visible={this.state.forwardRequest}
                    forwardList={() => this.getForwardList()}
                    close={() => this.setState({ forwardRequest: false, currentForwardItem: null })}
                    forward={() => this.onForward()} />);
        }

        return (
            <View style={styles.container}>
                {forwardModal}
                <Header
                    leftComponent={<IconWrapper name='chevron-left' type='font-awesome' color='white' size={28} onPress={() => Actions.pop()} />}
                    centerComponent={{ text: 'Request Details', style: styles.headerText }}
                    rightComponent={forwardIcon}
                    outerContainerStyles={styles.headerOuterContainer} />
                <View style={styles.bodyContainer}>
                    {this.renderRequest()}
                </View>
                {buttons}
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestDetails);