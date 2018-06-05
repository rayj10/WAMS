import React from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
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
                <Image style={styles.image} source={require('../../assets/images/Link.png')} />
                <Text style={styles.buttonText}> Link </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ option: 'information' })}>
              <View style={styles.button}>
                <Image style={styles.image} source={require('../../assets/images/Information.png')} />
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
          <Scanner onRead={this.onBarcodeRead.bind(this)} />
          <View style={styles.backButtonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ option : null })}>
              <View style={styles.backButton}>
                <Icon name='chevron-left' type='font-awesome' color='white' size={24} />
                <Text style={styles.backText}> Back </Text>
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
