import React from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { Header, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import Scanner from '../../components/Scanner';
import styles from './styles';
import { color } from '../../theme/baseTheme'

class QRScanner extends React.Component {
  constructor() {
    super();
    this.state = {
      option: null
    }
  }

  onBarcodeRead(type, data) {
    if (this.state.option === 'information') {
      Alert.alert(
        'A ' + type + ' has been found',
        '\nContent:\n' + data
      );
    }
    else {
      Alert.alert(
        'A ' + type + ' has been found',
        '\nContent:\n' + data,
        [{ text: 'Open URL', onPress: () => Linking.openURL(data) },
        { text: 'Cancel', onPress: () => { } }]
      );
    }
  }

  render() {
    let option = this.state.option;
    let render = (
      <View style={styles.container}>
        <Text style={styles.subheader}>
          What would you like to scan?
        </Text>
        <View style={styles.body}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ option: 'link' })}>
              <View style={styles.button}>
                <Image style={styles.image} source={require('../../assets/images/Link.png')} />
                <Text style={styles.buttonText}> Scan Link </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ option: 'information' })}>
              <View style={styles.button}>
                <Image style={styles.image} source={require('../../assets/images/Information.png')} />
                <Text style={styles.buttonText}> Scan Information </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );

    if (option) {
      render = <Scanner onRead={this.onBarcodeRead} />
    }

    return render;
  }
}

export default QRScanner;
