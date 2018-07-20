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

//Maps store's state to ViewRequest's props
export const mapStateToProps = state => ({
  token: state.authReducer.token,
  requestConfirmationList: state.workspaceReducer.requestConfirmationList,
  requestConfirmationReceived: state.workspaceReducer.requestConfirmationReceived,
});

//Maps imported actions to ViewRequest's props
export const mapDispatchToProps = (dispatch) => ({
  actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
  actionsAuth: bindActionCreators(authAction, dispatch)
});

class MyConfirmation extends React.Component {
  constructor() {
    super();
    this.state = {
      fetchStatus: null
    };

    this.onFetchFinish = this.onFetchFinish.bind(this);
  }

  //fetch data to be displayed as soon as the component is mounted
  componentDidMount() {
    this.mounted = true;
    this.props.actionsWorkspace.getRequestConfirmation(this.props.token, this.onFetchFinish)
  }

  /**
   * Callback to be called when the list fetching process is done
   * @param {String} listName: The type of list fetched
   * @param {String} status: Fetch status response (directly related to HTTP status code response) 
   */
  onFetchFinish(status) {
    if (status === 'Authentication Denied' && this.props.token) {
      Alert.alert(status, errors[status])
      this.props.actionsAuth.signOut(this.props.actionsWorkspace.successSignOut.bind(this));
      Actions.reset("Auth");
    }
    else if (this.mounted)
      this.setState({ fetchStatus: status })
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
    let keys = DBkeys[pageName].Confirmation;
    let refresh = (finishRefresh) => this.props.actionsWorkspace.getRequestConfirmation(this.props.token, (status) => this.onFetchFinish(status, finishRefresh && finishRefresh()));

    if (this.props.requestConfirmationReceived)
      return <SummaryListPage title={pageName} status={this.state.fetchStatus} onRefresh={refresh} list={this.props.requestConfirmationList} keys={keys} onShowDetails={(reqHead) => Actions.RequestConfirm({ header: reqHead, keys, refresh })} />
    else
      return <SummaryListPage title={pageName} status={this.state.fetchStatus} onRefresh={refresh} />
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderPage('Requests')}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyConfirmation);
