import React from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'react-native-elements';
import { View, Text, Alert, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';

import styles from "./styles";
import * as workspaceAction from '../../../actions/workspaceActions';
import * as authAction from '../../../actions/authActions';
import { img } from '../../../assets/images';
import errors from '../../../json/errors.json';
import DBkeys from '../../../json/DBkeys.json';
import { color, normalize } from '../../../theme/baseTheme';

//Maps store's state to TaskList's props
export const mapStateToProps = state => ({
  token: state.authReducer.token,
  userDetails: state.authReducer.userDetails,
  taskList: state.workspaceReducer.taskList,
  taskListReceived: state.workspaceReducer.taskListReceived,
  intraTaskList: state.workspaceReducer.intraTaskList,
  intraTaskListReceived: state.workspaceReducer.intraTaskListReceived
});

//Maps imported actions to TaskList's props
export const mapDispatchToProps = (dispatch) => ({
  actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
  actionsAuth: bindActionCreators(authAction, dispatch)
});

class MyListItem extends React.PureComponent {
  render() {
    let info = this.props.buildPanel(this.props.item);
    category = info.slice(3);
    info = info.slice(0, 3);
    return (
      <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.TaskDetails({ DONo: this.props.findDONo(this.props.item[DBkeys['Task List'].ticket]), header: this.props.item, keys: DBkeys['Task List'], refesh: this.props.refresh })}>
        <View style={styles.outterPanel}>
          <View style={[styles.innerPanel, { flex: 3 }]}>
            {info}
          </View>
          <View style={styles.innerPanel}>
            {category}
          </View>
        </View>
      </TouchableOpacity>)
  }
}

class TaskList extends React.Component {
  constructor() {
    super();
    this.state = {
      intranetFetch: null,
      wamsFetch: null,
      refreshing: false
    };

    this.onFetchFinish = this.onFetchFinish.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  //fetch data to be displayed as soon as the component is mounted
  componentDidMount() {
    this.mounted = true;
    this.props.actionsWorkspace.getTaskList(this.props.userDetails.Empl_id, this.onFetchFinish);
    this.props.actionsWorkspace.getListDOCustomer(this.props.token, this.onFetchFinish, 2);
  }

  /**
   * Callback to be called when the list fetching process is done
   * @param {String} status: Fetch status response (directly related to HTTP status code response)
   * @param {String} from: Indicates which api result is this from 
   */
  onFetchFinish(status, from) {
    if (status === 401 && this.props.token) {
      Alert.alert(errors[status].name, errors[status].message)
      this.props.actionsAuth.signOut(this.props.actionsWorkspace.successSignOut.bind(this));
      Actions.reset("Auth");
    }
    else if (this.mounted)
      from === 'Intranet' ?
        this.setState({ intranetFetch: status })
        :
        this.setState({ wamsFetch: status })
  }

  componentWillUnmount() {
    //To make sure setState is not called when component is unmounted before fetch finished
    this.mounted = false;
  }

  /**
  * Render out list of items
  */
  renderSummary() {
    if (this.props.intraTaskListReceived)
      return this.props.intraTaskList.map((item) => {
        return <MyListItem item={item} buildPanel={this.buildPanel.bind(this)} findDONo={this.findDONo.bind(this)} refresh={this.onRefresh.bind(this)} />
      });
  }

  /**
   * Get related DO number from list of WAMS' DO Customer List based on given ticket
   * @param {String} ticketNo: Ticket number to find relating DO number of 
   */
  findDONo(ticketNo) {
    let DOheader = this.props.taskListReceived && this.props.taskList ? this.props.taskList.find((element) => { return element[DBkeys['DO Customer'].ticket] === ticketNo }) : null;
    return DOheader ? DOheader[DBkeys['DO Customer'].no] : null
  }
  /**
   * Pick out desired information to be rendered
   * @param {Object} item: individual item information from the mapped array in renderSummary
   */
  buildPanel(item) {
    let panel = [];
    let keys = DBkeys['Task List'];
    let date = new Date(item[keys['date']].replace(/\./g, '-')).toString().split(' ');

    panel.push(<Text style={{ left: 10 }} key={'date'}>
      <Text style={styles.itemName}>{`${date[2]} ${date[1]} ${date[3]}`}</Text>
    </Text>);
    panel.push(<Text style={{ left: 10 }} key={'time'}>
      <Text style={styles.titleTextStyle}>{"Jam Pergi: "}</Text>
      <Text style={styles.textStyle}>{item[keys['time']]}</Text>
    </Text>);
    panel.push(<Text style={{ left: 10 }} key={'PIC'}>
      <Text style={styles.titleTextStyle}>{"PIC staff: "}</Text>
      <Text style={styles.textStyle}>{item[keys['pic']]}</Text>
    </Text>);
    panel.push(<View style={{ justifyContent: 'center', alignItems: 'center' }} key={'category'}>
      <Text style={styles.titleTextStyle}>{"Kategori: "}</Text>
      <Icon name={img.taskCategory[item[keys['category']]].name} type={img.taskCategory[item[keys['category']]].type} color={img.taskCategory[item[keys['category']]].color} size={normalize(42)} />
    </View>);

    return panel;
  }

  /**
     * Callback to be executed when user use the pull-to-refresh gesture on the list
     */
  onRefresh() {
    if (this.mounted)
      this.setState({ refreshing: true },
        () => {
          this.props.actionsWorkspace.getTaskList(this.props.userDetails.Empl_id, this.onFetchFinish, this.setState({ refreshing: false }));
          this.props.actionsWorkspace.getListDOCustomer(this.props.token, this.onFetchFinish, 2);
        });
  }

  render() {
    let status = this.state.intranetFetch;

    let content = ([
      <View style={{ marginTop: 20 }}>
        <ActivityIndicator animating={true} size='large' />
      </View>]);

    if (status !== null) {
      if (status === 'success' && this.props.intraTaskList) {
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
        <Text style={styles.subHeader}>Task List</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
