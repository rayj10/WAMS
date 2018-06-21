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

//Maps store's state to ViewRequest's props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    requestViewList: state.workspaceReducer.requestViewList,
    requestViewReceived: state.workspaceReducer.requestViewReceived,
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
            PO: 'Access Denied',         //needs to be nulled
            transfer: 'Access Denied',   //needs to be nulled
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
     * @param {Function} finishCB: callback to be called once the lists has been fetched (optional)
     */
    getLists(finishCB) {
        this.props.actionsWorkspace.getRequestView(this.props.token, (listName,status)=>this.onFetchFinish(listName,status, finishCB&&finishCB()));
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
     * Map keys returned by API into internally uniform keys to be used by SummaryListPage
     * Needed because of the different key names for each form returned in json by API
     * @param {String} pageName: Name of page getting displayed 
     */
    getKeys(pageName) {
        let keys = {
            Requests: {
                id: 'RequestNo',
                department: 'dept_nm',
                date: 'RequestDate',
                status: 'StatusName',
            },
            PO: {
                id: 'RequestNo',
                department: 'dept_nm',
                date: 'RequestDate',
                status: 'StatusName',
            },
            Transfers: {
                id: 'RequestNo',
                department: 'dept_nm',
                date: 'RequestDate',
                status: 'StatusName',
            },
        }

        return keys[pageName];
    }

    /**
    * Page Template to render information based on pageName and availability of data
    * @param {String} pageName: Page to be rendered  
    */
    renderPage(pageName) {
        if (pageName === 'Requests') {
            if (this.props.requestViewReceived)
                return <SummaryListPage title={pageName} status={this.state.request} onRefresh={this.getLists} list={this.props.requestViewList.data} keys={this.getKeys(pageName)} onShowDetails={(reqHead) => Actions.RequestDetails({ request: reqHead, caller: 'View' })} />
            else
                return <SummaryListPage title={pageName} status={this.state.request} onRefresh={this.getLists} />
        }
        else if (pageName === 'PO') {
            if (false) //this.props.isPOListReceived
                return <SummaryListPage title={pageName} status={this.state.PO} onRefresh={this.getLists} list={this.props.requestViewList.data} keys={this.getKeys(pageName)} onShowDetails={() => { }} />
            else
                return <SummaryListPage title={pageName} status={this.state.PO} onRefresh={this.getLists} />
        }
        else if (pageName === 'Transfers') {
            if (false) //this.props.isTransferListReceived
                return <SummaryListPage title={pageName} status={this.state.transfer} onRefresh={this.getLists} list={this.props.requestViewList.data} keys={this.getKeys(pageName)} onShowDetails={() => { }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewRequest);
