import React from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Header, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import IconWrapper from '../../components/IconWrapper';
import styles from './styles';

class Setting extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text> This will be where you customize your profile</Text>
        </View>
      </View>
    );
  }
}

export default Setting;
