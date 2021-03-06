import React from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text, Alert, FlatList, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';

import styles from "./styles";
import * as workspaceAction from '../../../actions/workspaceActions';
import * as authAction from '../../../actions/authActions';
import { color, normalize } from '../../../theme/baseTheme';
import errors from '../../../json/errors.json';
import DBkeys from '../../../json/DBkeys.json';
import { img } from '../../../assets/images';

//Maps store's state to MyRequest's props
export const mapStateToProps = state => ({
  token: state.authReducer.token,
  myRequestList: state.workspaceReducer.myRequestList,
  myRequestListReceived: state.workspaceReducer.myRequestListReceived
});

//Maps imported actions to MyRequest's props
export const mapDispatchToProps = (dispatch) => ({
  actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
  actionsAuth: bindActionCreators(authAction, dispatch)
});

class MyListItem extends React.PureComponent {
  render() {
    return (<View style={styles.outterPanel}>
      <View style={styles.innerPanel}>
        {this.props.buildPanel((this.props.index + 1), this.props.item)}
      </View>
    </View>)
  }
}

class MyRequest extends React.Component {
  constructor() {
    super();
    this.state = {
      fetchStatus: null,
      refreshing: false
    };

    this.onFetchFinish = this.onFetchFinish.bind(this);
  }

  //fetch data to be displayed as soon as the component is mounted
  componentDidMount() {
    this.mounted = true;
    this.props.actionsWorkspace.getItemRequestBy(this.props.token, this.onFetchFinish)
  }

  /**
   * Callback to be called when the list fetching process is done
   * @param {String} listName: The type of list fetched
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
   * Render out list of items
   */
  renderSummary() {
    if (this.props.myRequestListReceived)
      return this.props.myRequestList.map((item, index) => {
        return <MyListItem index={index} item={item} buildPanel={this.buildPanel.bind(this)} />
      });
  }

  /**
   * Pick out desired information to be rendered
   * @param {Object} item: individual item information from the mapped array in renderSummary
   */
  buildPanel(index, item) {
    let panel = [];
    let keys = DBkeys['Requests'].MyRequest;

    panel.push(<Text style={{ marginHorizontal: normalize(10) }} key={'item'}>
      <Text style={styles.itemName}>{index + ". " + item[keys['item']]}</Text>
    </Text>);
    panel.push(<Text style={{ left: 10 }} key={'code'}>
      <Text style={styles.titleTextStyle}>{"Item Code: "}</Text>
      <Text style={styles.textStyle}>{item[keys['code']]}</Text>
    </Text>);
    panel.push(<Text style={{ left: 10 }} key={'amount'}>
      <Text style={styles.titleTextStyle}>{"Ordered: "}</Text>
      <Text style={styles.textStyle}>{item[keys['amount']] + " " + item[keys['unit']]}</Text>
    </Text>);
    panel.push(<Text style={{ left: 10 }} key={'SOH'}>
      <Text style={styles.titleTextStyle}>{"SOH: "}</Text>
      <Text style={styles.textStyle}>{item[keys['inWarehouse']] + " " + item[keys['unit']]}</Text>
    </Text>);
    panel.push(<Text style={{ left: 10 }} key={'date'}>
      <Text style={styles.titleTextStyle}>{"Target Date: "}</Text>
      <Text style={styles.textStyle}>{item[keys['date']].split("T")[0]}</Text>
    </Text>);
    let status = item[keys['status']];
    panel.push(<View style={{ position: 'absolute', right: 0, bottom: 0, padding: normalize(5), alignItems: 'center' }} key={'status'}>
      <Icon name={img.itemStatus[status].name} type={img.itemStatus[status].type} color={img.itemStatus[status].color} size={normalize(38)} />
    </View>);

    return panel;
  }

  /**
   * Callback to be executed when user use the pull-to-refresh gesture on the list
   */
  onRefresh() {
    if (this.mounted)
      this.setState({ refreshing: true },
        () => this.props.actionsWorkspace.getItemRequestBy(this.props.token, (status) => this.onFetchFinish(status, this.setState({ refreshing: false }))));
  }

  render() {
    let status = this.state.fetchStatus;

    let content = ([
      <View style={{ marginTop: 20 }}>
        <ActivityIndicator animating={true} size='large' />
      </View>]);

    if (status !== null) {
      if (status === 'success' && this.props.myRequestList) {
        content = this.renderSummary();
      }
      else {
        if (!errors[status])
          status = 'Unknown Error';
        content = ([
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.textStyle, { textAlign: 'center', fontSize: 20 }]}>{'\n\n' + errors[status].name + '\n'}</Text>
            <Text style={[styles.textStyle, { textAlign: 'center', fontSize: 16 }]}>{errors[status].message}</Text>
          </View>
        ]);
      }
    }

    return (
      <View style={styles.container}>
        <Text style={styles.subHeader}>My Requests</Text>
        <View style={[styles.panelContainer, status === 'success' ? {} : { backgroundColor: color.white }]}>
          <FlatList
            showsVerticalScrollIndicator={false}
            progressViewOffset={-10}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
            onMomentumScrollEnd={(event) => event.nativeEvent.contentOffset.y === 0 ? this.onRefresh() : null}
            data={content}
            renderItem={({ item }) => item}
            keyExtractor={(item, key) => key.toString()} />
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyRequest);
