import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import styles from './styles';
import { color } from '../../theme/baseTheme';
import * as img from '../../assets/images';

class Help extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.horizontalContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions['User Manual'].call()}>
              <View style={styles.button}>
                <Image style={styles.image} source={img.UserManual} />
                <Text style={styles.buttonText}> User Manual </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions['FAQ'].call()}>
              <View style={styles.button}>
                <Image style={styles.image} source={img.FAQ} />
                <Text style={styles.buttonText}> FAQ </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
              <View style={styles.button}>
                <Image style={styles.image} source={img.Test} />
                <Text style={styles.buttonText}> Test Panel </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.horizontalContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
              <View style={styles.button}>
                <Image style={styles.image} source={img.Test} />
                <Text style={styles.buttonText}> Test Panel </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
              <View style={styles.button}>
                <Image style={styles.image} source={img.Test} />
                <Text style={styles.buttonText}> Test Panel </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.horizontalContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
              <View style={styles.button}>
                <Image style={styles.image} source={img.Test} />
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
