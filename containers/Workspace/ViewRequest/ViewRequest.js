import React from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Pages } from 'react-native-pages';

import styles from "./styles";
import SummaryListPage from '../../../components/SummaryListPage';
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

    componentWillUnmount() {
        //To make sure setState is not called when component is unmounted before fetch finished
        this.mounted = false;
    }

    /**
    * Page Template to render information based on pageName and availability of data
    * @param {String} pageName: Page to be rendered  
    */
    renderPage(pageName) {
        if (pageName === 'Requests') {
            if (this.props.isRequestListReceived)
                return <SummaryListPage title={pageName} status={this.state.request} list={this.props.requestList.data} caller='View' />
            else
                return <SummaryListPage title={pageName} status={this.state.request} list={null} caller='View' />
        }
        else if (pageName === 'PO') {
            if (false) //this.props.isPOListReceived
                return <SummaryListPage title={pageName} status={this.state.PO} list={this.props.requestList.data} caller='View' />
            else
                return <SummaryListPage title={pageName} status={this.state.PO} list={null} caller='View' />
        }
        else if (pageName === 'Transfers') {
            if (false) //this.props.isTransferListReceived
                return <SummaryListPage title={pageName} status={this.state.transfer} list={this.props.requestList.data} caller='View' />
            else
                return <SummaryListPage title={pageName} status={this.state.transfer} list={null} caller='View' />
        }
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
