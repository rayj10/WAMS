import React from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import styles from "./styles";
import SummaryListPage from '../../../components/SummaryListPage';
import * as workspaceAction from '../../../actions/workspaceActions';
import * as authAction from '../../../actions/authActions';
import { color, windowWidth } from '../../../theme/baseTheme';
import errors from '../../../json/errors.json';
import DBkeys from '../../../json/DBkeys.json';

//Maps store's state to Approval's props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    requestApprovalList: state.workspaceReducer.requestApprovalList,
    requestApprovalReceived: state.workspaceReducer.requestApprovalReceived,
    POApprovalList: state.workspaceReducer.POApprovalList,
    POApprovalReceived: state.workspaceReducer.POApprovalReceived,
    transferApprovalList: state.workspaceReducer.transferApprovalList,
    transferApprovalReceived: state.workspaceReducer.transferApprovalReceived
});

//Maps imported actions to Approval's props
export const mapDispatchToProps = (dispatch) => ({
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
    actionsAuth: bindActionCreators(authAction, dispatch)
});

class Approval extends React.Component {
    constructor() {
        super();
        this.state = {
            request: null,
            PO: null,         
            transfer: null,   
            carouselIndex: 0
        };

        this.onFetchFinish = this.onFetchFinish.bind(this);
        this.getLists = this.getLists.bind(this);
    }

    //fetch data to be displayed as soon as the component is mounted
    componentDidMount() {
        this.mounted = true;
        this.getLists();
    }

    /**
     * Get list of Requests, PO and Transfers
     * @param {Function} finishCB: callback to be called once the lists has been fetched (optional, for pull-refresh function)
     */
    getLists(finishCB) {
        this.props.actionsWorkspace.getRequestApproval(this.props.token, (listName, status) => this.onFetchFinish(listName, status, finishCB && finishCB()));
        this.props.actionsWorkspace.getPOApproval(this.props.token, (listName, status) => this.onFetchFinish(listName, status, finishCB && finishCB()));
        this.props.actionsWorkspace.getTransferApproval(this.props.token, (listName, status) => this.onFetchFinish(listName, status, finishCB && finishCB()));
    }

    /**
     * Callback to be called when the list fetching process is done
     * @param {String} listName: The type of list fetched
     * @param {String} status: Fetch status response (directly related to HTTP status code response) 
     */
    onFetchFinish(listName, status) {
        if (status === 401 && this.props.token) {
            Alert.alert(errors[status].name, errors[status].message)
            this.props.actionsAuth.signOut(this.props.actionsWorkspace.successSignOut.bind(this));
            Actions.reset("Auth");
        }
        else if (this.mounted) {
            if (listName === 'Requests')
                this.setState({ request: status })
            else if (listName === 'PO')
                this.setState({ PO: status })
            else if (listName === 'Transfers')
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
        let keys = DBkeys[pageName].Approval;

        if (pageName === 'Requests') {
            if (this.props.requestApprovalReceived)
                return <SummaryListPage title={pageName} status={this.state.request} onRefresh={this.getLists} list={this.props.requestApprovalList} keys={keys} onShowDetails={(reqHead) => Actions.RequestDetails({ header: reqHead, caller: 'Approval', keys, refresh: this.getLists })} />
            else
                return <SummaryListPage title={pageName} status={this.state.request} onRefresh={this.getLists} />
        }
        else if (pageName === 'PO') {
            if (this.props.POApprovalReceived)
                return <SummaryListPage title={pageName} status={this.state.PO} onRefresh={this.getLists} list={this.props.POApprovalList} keys={keys} onShowDetails={(POHead) => Actions.PODetails({ header: POHead, caller: 'Approval', keys, refresh: this.getLists })} />
            else
                return <SummaryListPage title={pageName} status={this.state.PO} onRefresh={this.getLists} />
        }
        else if (pageName === 'Transfers') {
            if (this.props.transferApprovalReceived)
                return <SummaryListPage title={pageName} status={this.state.transfer} onRefresh={this.getLists} list={this.props.transferApprovalList} keys={keys} onShowDetails={(trfHead) => Actions.TransferDetails({ header: trfHead, caller: 'Approval', keys, refresh: this.getLists })} />
            else
                return <SummaryListPage title={pageName} status={this.state.transfer} onRefresh={this.getLists} />
        }
    }

    render() {
        let pages = [
            this.renderPage('Requests'),
            this.renderPage('PO'),
            this.renderPage('Transfers')
        ];

        return (
            <View style={styles.container}>
                <Carousel
                    data={pages}
                    renderItem={({ item, index }) => item}
                    sliderWidth={windowWidth}
                    itemWidth={windowWidth}
                    useScrollView={true}
                    lockScrollWhileSnapping={true}
                    activeSlideOffset={windowWidth / 3}
                    swipeThreshold={windowWidth / 3}
                    onSnapToItem={(index) => this.setState({ carouselIndex: index })}
                />
                <Pagination
                    dotsLength={pages.length}
                    activeDotIndex={this.state.carouselIndex}
                    containerStyle={styles.pageIndicator}
                    dotColor={color.blue}
                    inactiveDotColor={color.blue}
                    inactiveDotOpacity={0.3}
                    inactiveDotScale={0.6}
                />
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Approval);
