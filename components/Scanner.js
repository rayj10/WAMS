import React from 'react';
import {
    Alert,
    Linking,
    Text,
    View,
    StyleSheet
} from 'react-native';
import { BarCodeScanner, Permissions, Camera } from 'expo';

import { windowWidth, windowHeight } from '../theme/baseTheme';

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scanArea: {
        height: windowHeight - 65,
        width: windowWidth
    },
    layerTop: {
        flex: 1,
        backgroundColor: opacity
    },
    layerCenter: {
        flex: 2,
        flexDirection: 'row'
    },
    layerLeft: {
        flex: 1,
        backgroundColor: opacity
    },
    focused: {
        flex: 10
    },
    layerRight: {
        flex: 1,
        backgroundColor: opacity
    },
    layerBottom: {
        flex: 1,
        backgroundColor: opacity
    },
});

export default class Scanner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasCameraPermission: null,
            lastScan: null,
            type: this.props.type
        };
    }
    componentDidMount() {
        this._requestCameraPermission();
    }

    _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted',
        });
    };

    /**
     * Callback to be called by BarcodeScanner once it reads a compatible barcode, with param destructured
     * @param {Object} result: The result will be in the form of {type:String, data:String}
     */
    onSuccessRead = ({ type, data }) => {
        if (data !== this.state.lastScan) {
            this.setState({ lastScan: data })

            //Get a displayable version of the passed barcode type
            switch (type) {
                case BarCodeScanner.Constants.BarCodeType.aztec: type = "Aztec"; break;
                case BarCodeScanner.Constants.BarCodeType.codabar: type = "Codabar"; break;
                case BarCodeScanner.Constants.BarCodeType.code128: type = "Code128"; break;
                case BarCodeScanner.Constants.BarCodeType.code138: type = "Code138"; break;
                case BarCodeScanner.Constants.BarCodeType.code39: type = "Code39"; break;
                case BarCodeScanner.Constants.BarCodeType.code39mod43: type = "Code39mod43"; break;
                case BarCodeScanner.Constants.BarCodeType.code93: type = "Code93"; break;
                case BarCodeScanner.Constants.BarCodeType.datamatrix: type = "Datamatrix"; break;
                case BarCodeScanner.Constants.BarCodeType.ean13: type = "Ean13"; break;
                case BarCodeScanner.Constants.BarCodeType.ean8: type = "Ean8"; break;
                case BarCodeScanner.Constants.BarCodeType.interleaved2of5: type = "Interleaved2of5"; break;
                case BarCodeScanner.Constants.BarCodeType.itf14: type = "Itf14"; break;
                case BarCodeScanner.Constants.BarCodeType.maxicode: type = "Maxicode"; break;
                case BarCodeScanner.Constants.BarCodeType.pdf417: type = "Pdf417"; break;
                case BarCodeScanner.Constants.BarCodeType.qr: type = "QRCode"; break;
                case BarCodeScanner.Constants.BarCodeType.rss14: type = "Rss14"; break;
                case BarCodeScanner.Constants.BarCodeType.rssexpanded: type = "Rssexpanded"; break;
                case BarCodeScanner.Constants.BarCodeType.upc_a: type = "Upc_a"; break;
                case BarCodeScanner.Constants.BarCodeType.upc_e: type = "Upc_e"; break;
                case BarCodeScanner.Constants.BarCodeType.upc_ean: type = "Upc_ean"; break;
            }

            this.props.onRead(type, data); //callback, what to do with the data on success read
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.hasCameraPermission === null ?
                        <Text>Requesting for camera permission</Text> :
                        this.state.hasCameraPermission === false ?
                            <Text style={{ color: '#fff' }}> Camera permission is not granted </Text> :

                            <BarCodeScanner
                                onBarCodeRead={this.onSuccessRead.bind(this)}
                                style={styles.scanArea}
                                autoFocus={Camera.Constants.AutoFocus.on}>
                                
                                <View style={styles.layerTop} />
                                <View style={styles.layerCenter}>
                                    <View style={styles.layerLeft} />
                                    <View style={styles.focused} />
                                    <View style={styles.layerRight} />
                                </View>
                                <View style={styles.layerBottom} />
                            </BarCodeScanner>
                }
            </View>
        );
    }
}
