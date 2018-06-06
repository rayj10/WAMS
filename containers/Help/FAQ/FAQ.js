import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';

import styles from './styles';

class FAQ extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text> This will be where you see the Frequently Asked Questions</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.pop()}>
            <View style={styles.backButton}>
              <Icon name='action-undo' type='simple-line-icon' size={40} color='white' />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default FAQ;
