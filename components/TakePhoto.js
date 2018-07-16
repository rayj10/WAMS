import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { Actions } from 'react-native-router-flux';

import { TakePicture, Gallery } from '../assets/images';
import { padding, color, fontSize, fontFamily, windowWidth, normalize, windowHeight } from '../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  subheader: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.large - 2,
    alignSelf: 'center',
    marginTop: normalize(40),
    marginHorizontal: normalize(20)
  },

  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 30
  },

  buttonContainer: {
    height: normalize(150),
    width: normalize((windowWidth - 20) / 3)
  },

  button: {
    flex: 1,
    borderWidth: 1,
    borderRadius: normalize(8),
    borderColor: color.light_blue,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    height: normalize(75),
    width: normalize(75),
    resizeMode: 'contain'
  },

  buttonText: {
    color: color.light_blue,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.regular
  },

  previewButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: windowWidth,
    height: normalize(70),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .3)'
  },

  previewButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: 5,
    marginVertical: 15,
    borderRadius: 8,
    borderColor: color.white,
  },

  previewButtonText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.regular,
    color: color.white
  }
});

export default class TakePhoto extends React.Component {
  state = {
    image: null,
    hasCameraPermission: null,
    hasGalleryPermission: null
  };

  componentDidMount() {
    this._requestCameraPermission();
    this._requestGalleryPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _requestGalleryPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      hasGalleryPermission: status === 'granted',
    });
  };

  render() {
    let { image } = this.state;

    return this.state.hasCameraPermission === null || this.state.hasGalleryPermission === null ?
      <Text>Requesting for camera permission</Text> :
      this.state.hasCameraPermission === false ?
        <Text style={{ color: '#fff' }}> Camera permission is not granted </Text> :
        this.state.hasGalleryPermission === false ?
          <Text style={{ color: '#fff' }}> Gallery permission is not granted </Text> :

          image ?
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Image source={{ uri: 'data:image/jpg;base64,' + image }} style={{ width: windowWidth, height: windowHeight }} />
              </View>
              <View style={styles.previewButtonContainer}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.pictureTaken(this.state.image)}>
                  <View style={styles.previewButton}>
                    <Text style={styles.previewButtonText}> Use Picture </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ image: null })}>
                  <View style={styles.previewButton}>
                    <Text style={styles.previewButtonText}> Pick Another </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            :
            <View style={styles.container}>
              <Text style={styles.subheader}>
                Where would you like the photo from?
          </Text>
              <View style={styles.body}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={this._pickImage}>
                    <View style={styles.button}>
                      <Image style={styles.image} source={Gallery} />
                      <Text style={styles.buttonText}> Gallery </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={this._takePhoto}>
                    <View style={styles.button}>
                      <Image style={styles.image} source={TakePicture} />
                      <Text style={styles.buttonText}> Camera </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });

    if (!result.cancelled) {
      this.setState({ image: result.base64 });
    }
  };

  _takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      base64: true,
    });

    if (!result.cancelled) {
      this.setState({ image: result.base64 });
    }
  };
}