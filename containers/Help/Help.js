import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import styles from './styles';
import { color } from '../../theme/baseTheme';

class Help extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.horizontalContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.UserManual()}>
              <View style={styles.button}>
                <Image style={styles.image} source={require('../../assets/images/UserManual.png')} />
                <Text style={styles.buttonText}> User Manual </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.FAQ()}>
              <View style={styles.button}>
                <Image style={styles.image} source={require('../../assets/images/FAQ.png')} />
                <Text style={styles.buttonText}> FAQ </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
              <View style={styles.button}>
                <Image style={styles.image} source={require('../../assets/images/Test.png')} />
                <Text style={styles.buttonText}> Test Panel </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.horizontalContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
              <View style={styles.button}>
                <Image style={styles.image} source={require('../../assets/images/Test.png')} />
                <Text style={styles.buttonText}> Test Panel </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
              <View style={styles.button}>
                <Image style={styles.image} source={require('../../assets/images/Test.png')} />
                <Text style={styles.buttonText}> Test Panel </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.horizontalContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
              <View style={styles.button}>
                <Image style={styles.image} source={require('../../assets/images/Test.png')} />
                <Text style={styles.buttonText}> Test Panel </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Help;
