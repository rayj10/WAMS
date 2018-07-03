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
import { color, normalize } from '../../../theme/baseTheme';

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
            forwardRequest: false,
            currentForwardItem: null,
            fetchStatus: null
        };

        this.onApprove = this.onApprove.bind(this);
        this.onDecline = this.onDecline.bind(this);
        this.onFetchFinish = this.onFetchFinish.bind(this);
    }

    componentDidMount() {
        this.props.actionsWorkspace.getRequestDetails(this.props.header[this.props.keys['id']], this.props.token, this.onFetchFinish);
        this.props.actionsWorkspace.getForwardList(this.props.token);
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
        if (this.props.forwardListReceived)
            return this.props.forwardList.map((item, key) =>
                <TouchableOpacity key={key} onPress={() => this.setState({ currentForwardItem: item['Name'] })}>
                    <View style={[styles.forwardListItem, this.state.currentForwardItem === item['Name'] ? styles.activeItem : {}]}>
                        <Text style={styles.forwardListText}>{item['Name']}</Text>
                    </View>
                </TouchableOpacity>);
        return [];
    }

    /**
     * What to do when forward button pressed
     */
    onForward() {
        this.setState({ forwardRequest: false });   //close modal
        let recipient = this.state.currentForwardItem;

        //Timeout is workaround for react native modal problem
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
        }, 1200);

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
            if (this.props.detailsReceived) {
                let { header, details, keys } = this.props;
                content = (
                    <ScrollView>
                        <View style={styles.requestHead}>
                            <View style={styles.subRequestHead}>
                                <Text style={styles.titleTextStyle}>{"Request No.:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['id']]}</Text>
                                <Text style={styles.titleTextStyle}>{"Request Date:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['date']]}</Text>
                            </View>
                            <View style={styles.subRequestHead}>
                                <Text style={styles.titleTextStyle}>{"Requestor:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['requestor']]}</Text>
                                <Text style={styles.titleTextStyle}>{"Department:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['department']]}</Text>
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
        let { keys } = this.props;

        return requestItems.map((item, key) => {
            let status = item[keys['status']];
            return (
                <View style={styles.itemPanel} key={key}>
                    <View style={styles.verticalSubPanel}>
                        <Text style={[styles.titleTextStyle, { marginLeft: 1 }]}>{(key + 1) + ". " + item[keys['item']]}</Text>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Amount:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['amount']]}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Est. Price:"}</Text>
                            <Text style={styles.textStyle}>{"Rp." + item[keys['price']]}</Text>
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
                            <Text style={styles.textStyle}>{item[keys['targetDate']]}</Text>
                        </View>
                        <View style={styles.horizontalSubPanel}>
                            <Text style={styles.titleTextStyle}>{"Requested By:"}</Text>
                            <Text style={styles.textStyle}>{item[keys['requestor']]}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalSubPanel}>
                        <Text style={[styles.titleTextStyle, { textAlign: 'right', marginLeft: 0 }]}>{"Status:"}</Text>
                        <Text
                            style={[
                                styles.titleTextStyle,
                                { marginLeft: 5 },
                                (status === 'Reject' || status === 'Cancel') ? { color: '#ff3030' } : (status === 'Open') ? { color: '#ffae19' } : { color: '#3fd130' }]}>
                            {status}
                        </Text>
                    </View>
                </View>)
        });
    }

    render() {
        let buttons = null;
        let forwardIcon = <View style={{ width: normalize(38) }} />;
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
            forwardIcon = (<IconWrapper name='paper-plane' type='font-awesome' style={[styles.icon, { marginRight: 15 }]} color='white' size={24} onPress={() => this.setState({ forwardRequest: true })} />);
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
                    leftComponent={<IconWrapper name='chevron-left' type='font-awesome' color='white' size={28} style={styles.icon} onPress={() => Actions.pop()} />}
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