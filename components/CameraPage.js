import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Camera, Permissions, Constants } from 'expo';
import { Actions } from 'react-native-router-flux';

import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../theme/baseTheme';
import IconWrapper from './IconWrapper';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
        justifyContent: 'space-between',
    },
    zoomContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    pictureSizeChooser: {
        justifyContent: 'center',
        flexDirection: 'row'
    },
    pictureSizeLabel: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        color: color.white,
        fontFamily: fontFamily.regular,
        fontSize: fontSize.large
    },
    topBar: {
        paddingTop: Constants.statusBarHeight / 2,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
});

class CameraPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
            pictureSize: undefined,
            pictureSizes: [],
            pictureSizeId: 0,
            zoom: 0,
        }
    }

    componentDidMount() {
        this._requestCameraPermission();
    }

    componentWillUnmount() {
        console.log(this.camera)
    }
    _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted',
        });
    };

    takePicture = () => {
        if (this.camera) {
            this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
        }
    };

    onPictureSaved = async photo => {
        this.props.pictureTaken(photo.uri);
    }

    collectPictureSizes = async () => {

        if (this.camera) {
            const pictureSizes = await this.camera.getAvailablePictureSizesAsync('4:3');
            let pictureSizeId = 0;
            if (Platform.OS === 'ios') {
                pictureSizeId = pictureSizes.indexOf('High');
            } else {
                // returned array is sorted in ascending order - default size is the largest one
                pictureSizeId = pictureSizes.length - 1;
            }
            this.setState({ pictureSizes, pictureSizeId, pictureSize: pictureSizes[pictureSizeId] });
        }
    };

    zoomOut = () => this.setState({ zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1 });
    zoomIn = () => this.setState({ zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1 });

    zoomButtons() {
        return (
            <View style={styles.zoomContainer}>
                <IconWrapper name="zoom-out" size={40} color={color.white} onPress={this.zoomOut} style={{ padding: 6 }} />
                <IconWrapper name="zoom-in" size={40} color={color.white} onPress={this.zoomIn} style={{ padding: 6 }} />
            </View>
        );
    }

    previousPictureSize = () => this.changePictureSize(1);
    nextPictureSize = () => this.changePictureSize(-1);

    changePictureSize = direction => {
        let newId = this.state.pictureSizeId + direction;
        const length = this.state.pictureSizes.length;
        if (newId >= length) {
            newId = 0;
        } else if (newId < 0) {
            newId = length - 1;
        }
        this.setState({ pictureSize: this.state.pictureSizes[newId], pictureSizeId: newId });
    };

    pictureSizePicker() {

        return (
            <View style={styles.pictureSizeChooser}>
                <IconWrapper name="chevron-left" size={40} color={color.white} onPress={this.previousPictureSize} style={{ padding: 6 }} />
                <View style={styles.pictureSizeLabel}>
                    <Text style={styles.textStyle}>{this.state.pictureSize}</Text>
                </View>
                <IconWrapper name="chevron-right" size={40} color={color.white} onPress={this.nextPictureSize} style={{ padding: 6 }} />
            </View>);
    }

    cameraModeButton() {
        return (<IconWrapper name="ios-reverse-camera-outline" type='ionicon' size={50} color={color.white} onPress={() => {
            this.setState({
                type: this.state.type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
            });
        }} style={{ flex: 1, justifyContent: 'center' }} />);
    }

    render() {
        const { hasCameraPermission } = this.state;

        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            console.log(this.camera)
            return (
                <View style={styles.container}>
                    <Camera
                        ref={ref => { this.camera = ref }}
                        style={{ flex: 1 }}
                        onCameraReady={this.collectPictureSizes}
                        type={this.state.type}
                        flashMode={Camera.Constants.FlashMode.auto}
                        autoFocus={Camera.Constants.AutoFocus.on}
                        zoom={this.state.zoom}
                        whiteBalance={Camera.Constants.WhiteBalance.auto}
                        pictureSize={this.state.pictureSize}>
                        <View style={styles.topBar}>
                            {this.pictureSizePicker()}
                            <IconWrapper name='close' color={color.white} size={30} onPress={() => Actions.pop()} style={{ position: 'absolute', top: normalize(20), left: normalize(10) }} />
                        </View>
                        <View style={styles.bottomBar}>
                            {this.zoomButtons()}
                            <IconWrapper name='radio-button-unchecked' color={color.white} size={70} onPress={this.takePicture} style={{ flex: 1, padding: 6 }} />
                            {this.cameraModeButton()}
                        </View>
                    </Camera>
                </View>
            );
        }
    }
}

export default CameraPage;