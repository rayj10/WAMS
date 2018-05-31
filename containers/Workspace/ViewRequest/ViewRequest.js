import React from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Pages } from 'react-native-pages';

import styles from "./styles";
import * as workspaceAction from '../../../actions/workspaceActions';
import * as authAction from '../../../actions/authActions';
import { color } from '../../../theme/baseTheme';

//Maps store's state to ViewRequest's props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    requestList: state.workspaceReducer.requestList,
    isRequestListReceived: state.workspaceReducer.isRequestListReceived,
});

//Maps imported actions to ViewRequest's props
export const mapDispatchToProps = (dispatch) => ({
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
    actionsAuth: bindActionCreators(authAction, dispatch)
});

class ViewRequest extends React.Component {
    constructor() {
        super();
        this.state = {
            request: null,
            PO: 'Access Denied',        //needs to be nulled
            transfer: 'Access Denied'   //needs to be nulled
        };

        this.onFetchFinish = this.onFetchFinish.bind(this);
    }

    //fetch data to be displayed as soon as the component is mounted
    componentDidMount() {
        this.mounted = true;
        this.props.actionsWorkspace.getRequestList(this.props.token, this.onFetchFinish);
    }

    /**
     * Callback to be called when the list fetching process is done
     * @param {String} listName: The type of list fetched
     * @param {String} status: Fetch status response (directly related to HTTP status code response) 
     */
    onFetchFinish(listName, status) {
        if (status === 'Authentication Denied') {
            Alert.alert(status, 'Your session may have expired please re-enter your login credentials')
            this.props.actionsAuth.signOut(this.props.actionsWorkspace.successSignOut.bind(this));
            Actions.reset("Auth");
        }
        else if (this.mounted) {
            if (listName = 'Requests')
                this.setState({ request: status })
            else if (listName = 'PO')
                this.setState({ PO: status })
            else if (listName = 'Transfers')
                this.setState({ transfer: status })
        }
    }
    
    componentWillUnmount(){
        //To make sure setState is not called when component is unmounted before fetch finished
        this.mounted = false;
    }

    /**
    * Page Template to render information based on pageName and availability of data
    * @param {String} pageName: Page to be rendered  
    */
    renderPage(pageName) {
        let content = (
            <View style={{ marginTop: 20 }}>
                <ActivityIndicator animating={true} size='large' />
            </View>);
        let status = '';

        /*
          If componentDidMount() still fetching the lists, 
          this if statement will be skipped and ActivityIndicator will be rendered.
        */
        if (this.state.request !== null && this.state.PO !== null && this.state.transfer !== null) {
            if (pageName === 'Requests') {
                status = this.state.request;
                if (this.props.isRequestListReceived)
                    content = this.renderRequestSummary(this.props.requestList.data)
            }
            else if (pageName === 'PO') {
                status = this.state.PO;
                if (false) //this.props.isPOListReceived
                {/*content = this.renderSummary(this.props.POList.data)*/ }
            }
            else if (pageName === 'Transfers') {
                status = this.state.transfer;
                if (false) //this.props.isTransferListReceived
                {/*content = this.renderSummary(this.props.transferList.data)*/ }
            }

            //determine message based on status
            if (status !== 'Authenticated') {
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
                <Text style={styles.subHeader}>{pageName}</Text>
                <View style={styles.panelContainer}>
                    <ScrollView>
                        {content}
                    </ScrollView>
                </View>
            </View>
        );
    }

    /**
     * Render out clickable request summary (request header) panels
     * @param {Array} requests: list of request header information to be extracted and rendered
     */
    renderRequestSummary(requests) {
        return requests.map((req, key) =>
            <TouchableOpacity onPress={() => Actions.RequestDetails({ request: req, caller: 'View' })} key={key}>
                <View style={styles.dataPanel}>
                    {this.buildPanel(req)}
                </View>
            </TouchableOpacity>
        );
    }

    /**
     * Pick out desired information from request header to be rendered
     * @param {Object} req: individual request header information from the mapped array in renderRequestSummary
     */
    buildPanel(req) {
        let panel = [];

        //determine color code for status
        let statusColor = { color: '#3fd130' };
        let status = req["StatusName"];
        if (status === 'Reject' || status === 'Cancel')
            statusColor = { color: '#ff3030' }
        else if (status === 'Open')
            statusColor = { color: '#ffae19' }

        panel.push(<Text style={{ left: 15 }} key={'reqNo'}>
            <Text style={styles.titleTextStyle}>{"Request No.: "}</Text>
            <Text style={styles.textStyle}>{req["RequestNo"]}</Text>
        </Text>);
        panel.push(<Text style={{ left: 15 }} key={'depNum'}>
            <Text style={styles.titleTextStyle}>{"Department Name: "}</Text>
            <Text style={styles.textStyle}>{req["dept_nm"]}</Text>
        </Text>);
        panel.push(<Text style={{ left: 15 }} key={'reqDate'}>
            <Text style={styles.titleTextStyle}>{"Request Date: "}</Text>
            <Text style={styles.textStyle}>{req["RequestDate"]}</Text>
        </Text>);
        panel.push(<Text style={{ left: 15 }} key={'status'}>
            <Text style={styles.titleTextStyle}>{"Status: "}</Text>
            <Text style={[styles.titleTextStyle, statusColor]}>{req["StatusName"]}</Text>
        </Text>);

        return panel;
    }

    render() {
        return (
            <View style={styles.container}>
                <Pages indicatorColor={color.blue} indicatorOpacity={0.2}>
                    {this.renderPage('Requests')}
                    {this.renderPage('PO')}
                    {this.renderPage('Transfers')}
                </Pages>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewRequest);
