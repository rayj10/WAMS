import React from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Alert } from 'react-native';

import styles from "./styles";
import SummaryListPage from '../../../components/SummaryListPage';
import * as workspaceAction from '../../../actions/workspaceActions';
import * as authAction from '../../../actions/authActions';
import errors from '../../../json/errors.json';
import DBkeys from '../../../json/DBkeys.json';

//Maps store's state to DOCustomer's props
export const mapStateToProps = state => ({
  token: state.authReducer.token,
  DOCustList: state.workspaceReducer.DOCustList,
  DOCustListReceived: state.workspaceReducer.DOCustListReceived
});

//Maps imported actions to DOCustomer's props
export const mapDispatchToProps = (dispatch) => ({
  actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
  actionsAuth: bindActionCreators(authAction, dispatch)
});

class DOCustomer extends React.Component {
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
    this.props.actionsWorkspace.getListDOCustomer(this.props.token, this.onFetchFinish, 1)
  }

  /**
   * Callback to be called when the list fetching process is done
   * @param {String} status: Fetch status response (directly related to HTTP status code response) 
   */
  onFetchFinish(status) {
    if (status === 401 && this.props.token) {
      Alert.alert(errors[status].name, errors[status].message)
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
    let keys = DBkeys[pageName];
    let refresh = (finishRefresh) => this.props.actionsWorkspace.getListDOCustomer(this.props.token, (status) => this.onFetchFinish(status, finishRefresh && finishRefresh()), 1);
 
    if (this.props.DOCustListReceived)
      return <SummaryListPage name={pageName} title={pageName} status={this.state.fetchStatus} onRefresh={refresh} list={this.props.DOCustList} keys={keys} onShowDetails={(reqHead) => Actions.DODetails({ header: reqHead, keys, refresh })} />
    else
      return <SummaryListPage name={pageName} title={pageName} status={this.state.fetchStatus} onRefresh={refresh} />
  }

  render() {
    return (
      <View style={styles.container}>
          {this.renderPage('DO Customer')}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DOCustomer);
