import React from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
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

  render() {
    let option = this.state.option;
    let render = (
      <View style={styles.container}>
        <View style={styles.button}>
          <Button
            raised
            borderRadius={4}
            title={'Scan Link'}
            backgroundColor={color.grey}
            textStyle={styles.buttonText}
            onPress={() => this.setState({ option: 'link' })} />
        </View>
        <View style={styles.button}>
          <Button
            raised
            borderRadius={4}
            title={'Scan Information'}
            backgroundColor={color.grey}
            textStyle={styles.buttonText}
            onPress={() => this.setState({ option: 'information' })} />
        </View>
      </View>
    );

    if (option) {
      render = <Scanner type={option} />
    }

    return render;
  }
}

export default QRScanner;
