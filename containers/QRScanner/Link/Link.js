import React from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import Scanner from '../../../components/Scanner';
import styles from './styles';

class Link extends React.Component {
  constructor() {
    super();

    this.state = {
      torchOn: false
    }

    this.onBarcodeRead = this.onBarcodeRead.bind(this);
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
        <Scanner onRead={this.onBarcodeRead} torch={this.state.torchOn ? 'on' : 'off'} />
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.pop()}>
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
