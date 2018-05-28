import React from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Header, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import styles from './styles';

class MyRequest extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text> My Request </Text>
        </View>
      </View>
    );
  }
}

export default MyRequest;
