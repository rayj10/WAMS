import React from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Alert } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import styles from "./styles";
import SummaryListPage from '../../../components/SummaryListPage';
import * as workspaceAction from '../../../actions/workspaceActions';
import * as authAction from '../../../actions/authActions';
import { color, windowWidth } from '../../../theme/baseTheme';
import errors from '../../../json/errors.json';
import DBkeys from '../../../json/DBkeys.json';

//Maps store's state to ViewPage's props
export const mapStateToProps = state => ({
  token: state.authReducer.token,
  requestViewList: state.workspaceReducer.requestViewList,
  requestViewReceived: state.workspaceReducer.requestViewReceived,
  POViewList: state.workspaceReducer.POViewList,
  POViewReceived: state.workspaceReducer.POViewReceived,
});

//Maps imported actions to ViewPage's props
export const mapDispatchToProps = (dispatch) => ({
  actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
  actionsAuth: bindActionCreators(authAction, dispatch)
});

class ViewPage extends React.Component {
  constructor() {
    super();
    this.state = {
      request: null,
      PO: null,         //needs to be nulled
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
    this.props.actionsWorkspace.getRequestView(this.props.token, (listName, status) => this.onFetchFinish(listName, status, finishCB && finishCB()));
    this.props.actionsWorkspace.getPOView(this.props.token, (listName, status) => this.onFetchFinish(listName, status, finishCB && finishCB()));
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
    let keys = DBkeys[pageName].View;

    if (pageName === 'Requests') {
      if (this.props.requestViewReceived)
        return <SummaryListPage name={pageName} title={'View Requests'} status={this.state.request} onRefresh={this.getLists} list={this.props.requestViewList} keys={keys} onShowDetails={(reqHead) => Actions.RequestDetails({ header: reqHead, caller: 'View', keys })} />
      else
        return <SummaryListPage name={pageName} title={'View Requests'} status={this.state.request} onRefresh={this.getLists} />
    }
    else if (pageName === 'PO') {
      if (this.props.POViewReceived)
        return <SummaryListPage name={pageName} title={'View PO'} status={this.state.PO} onRefresh={this.getLists} list={this.props.POViewList} keys={keys} onShowDetails={(POHead) => Actions.PODetails({ header: POHead, caller: 'View', keys, refresh: this.getLists})} />
      else
        return <SummaryListPage name={pageName} title={'View PO'} status={this.state.PO} onRefresh={this.getLists} />
    }
  }

  render() {
    let pages = [
      this.renderPage('Requests'),
      this.renderPage('PO')
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewPage);
