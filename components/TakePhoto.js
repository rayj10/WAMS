import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';

import { img } from '../assets/images';
import { color, fontSize, fontFamily, windowWidth, normalize, windowHeight } from '../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  infoContainer: {
    flex: 1,
    justifyContent: 'center'
  },

  infoText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.large,
    alignSelf: 'center'
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
  },

  backButtonContainer: {
    position: 'absolute',
    bottom: 0,
    height: normalize(60),
    width: normalize(60),
    backgroundColor: 'rgba(0, 0, 0, .4)',
    borderTopEndRadius: 10
  },

  backButton: {
    position: 'absolute',
    bottom: 0,
    height: normalize(57),
    width: normalize(57),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    borderTopEndRadius: 7
  }
});

export default class TakePhoto extends React.Component {
  state = {
    image: null,
    hasCameraPermission: null,
    hasGalleryPermission: null
  };

  componentDidMount() {
    this._requestPermissions();
  }

  _requestPermissions = async () => {
    const camera = await Permissions.askAsync(Permissions.CAMERA);
    const gallery = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    this.setState({
      hasCameraPermission: camera.status === 'granted',
      hasGalleryPermission: gallery.status === 'granted'
    });
  };

  render() {
    let { image } = this.state;

    return this.state.hasCameraPermission === null || this.state.hasGalleryPermission === null ?
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Requesting for camera permission</Text>
      </View>
      :
      this.state.hasCameraPermission === false ?
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}> Camera permission is not granted </Text>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.pop()}>
              <View style={styles.backButton}>
                <Icon name='action-undo' type='simple-line-icon' size={40} color='white' />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        :
        this.state.hasGalleryPermission === false ?
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}> Gallery permission is not granted </Text>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.pop()}>
                <View style={styles.backButton}>
                  <Icon name='action-undo' type='simple-line-icon' size={40} color='white' />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          :
          image ?
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Image source={{ uri: 'data:image/jpg;base64,' + image }} style={{ width: windowWidth, height: windowHeight }} />
              </View>
              <View style={styles.previewButtonContainer}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.pictureTaken(this.state.image)}>
                  <View style={styles.previewButton}>
                    <Text style={styles.previewButtonText}> {this.props.useMsg} </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ image: null })}>
                  <View style={styles.previewButton}>
                    <Text style={styles.previewButtonText}> Cancel </Text>
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
                  <TouchableOpacity style={{ flex: 1 }} onPress={this._pickImage} >
                    <View style={styles.button}>
                      <Image style={styles.image} source={img.menu.Gallery} />
                      <Text style={styles.buttonText}> Gallery </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={this._takePhoto} >
                    <View style={styles.button}>
                      <Image style={styles.image} source={img.menu.TakePicture} />
                      <Text style={styles.buttonText}> Camera </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.backButtonContainer}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.pop()}>
                  <View style={styles.backButton}>
                    <Icon name='action-undo' type='simple-line-icon' size={40} color='white' />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: false,
      quality: 0.4,
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
      quality: 0.4
    });

    if (!result.cancelled) {
      this.setState({ image: result.base64 });
    }
  };
}