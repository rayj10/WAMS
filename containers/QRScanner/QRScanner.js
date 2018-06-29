import React from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import Scanner from '../../components/Scanner';
import styles from './styles';
import { color } from '../../theme/baseTheme'
import { Link, Information } from '../../assets/images';

class QRScanner extends React.Component {
  constructor() {
    super();
    this.state = {
      option: null
    }

    this.onBarcodeRead = this.onBarcodeRead.bind(this);
  }

  onBarcodeRead(type, data, onCancel) {
    if (this.state.option === 'information') {
      Alert.alert(
        'A ' + type + ' has been found',
        'Content:\n' + data,
        [{ text: 'Got It!', onPress: onCancel() }]
      );
    }
    else {
      Alert.alert(
        'A ' + type + ' has been found',
        'Content:\n' + data,
        [{ text: 'Open URL', onPress: () => Linking.openURL(data) },
        { text: 'Cancel', onPress: onCancel() }]
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
                <Image style={styles.image} source={Link} />
                <Text style={styles.buttonText}> Link </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ option: 'information' })}>
              <View style={styles.button}>
                <Image style={styles.image} source={Information} />
                <Text style={styles.buttonText}> Information </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );

    if (option) {
      render = (
        <View style={{ flex: 1 }}>
          <Scanner onRead={this.onBarcodeRead} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ option: null })}>
              <View style={styles.backButton}>
                <Icon name='action-undo' type='simple-line-icon' size={40} color='white' />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return render;
  }
}

export default QRScanner;
