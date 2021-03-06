import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';

import styles from './styles';
import { img } from '../../assets/images';

class Help extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.horizontalContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.jump('User Manual')}>
              <View style={styles.button}>
                <Image style={styles.image} source={img.menu.UserManual} />
                <Text style={styles.buttonText}> User Manual </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.jump('FAQ')}>
              <View style={styles.button}>
                <Image style={styles.image} source={img.menu.FAQ} />
                <Text style={styles.buttonText}> FAQ </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
              <View style={styles.button}>
                <Image style={styles.image} source={img.menu.Test} />
                <Text style={styles.buttonText}> Test Panel </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.horizontalContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
              <View style={styles.button}>
                <Image style={styles.image} source={img.menu.Test} />
                <Text style={styles.buttonText}> Test Panel </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
              <View style={styles.button}>
                <Image style={styles.image} source={img.menu.Test} />
                <Text style={styles.buttonText}> Test Panel </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.horizontalContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { }}>
              <View style={styles.button}>
                <Image style={styles.image} source={img.menu.Test} />
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
