import React from 'react';
import { View, Alert, TouchableOpacity, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import Scanner from '../../../components/Scanner';
import styles from './styles';

class Link extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      torchOn: false,
      scanOn: true
    }

    this.onBarcodeRead = this.onBarcodeRead.bind(this);
  }

  componentDidUpdate() {
    if (this.state.scanOn !== this.props.scanOn)
      this.setState({ scanOn: this.props.scanOn })
  }

  onBarcodeRead(type, data, onCancel) {
    Alert.alert(
      'A ' + type + ' has been found',
      'Content:\n' + data,
      [{ text: 'Open URL', onPress: () => Linking.openURL(data) },
      { text: 'Cancel', onPress: onCancel() }]
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {//this.state.scanOn ?
          <Scanner
            onRead={this.onBarcodeRead}
            torch={this.state.torchOn ? 'on' : 'off'} 
            scanOn={this.state.scanOn}/>
          //: null
        }
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.setState({ scanOn: false }); Actions.pop(); }}>
            <View style={styles.backButton}>
              <Icon name='action-undo' type='simple-line-icon' size={40} color='white' />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.torchButtonContainer}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ torchOn: !this.state.torchOn })}>
            <View style={styles.torchButton}>
              {
                this.state.torchOn ?
                  <Icon name='flashlight-off' type='material-community' size={40} color='white' />
                  :
                  <Icon name='flashlight' type='material-community' size={40} color='white' />
              }
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Link;
