import React from 'react';
import { Provider } from 'react-redux';
import { Font, Asset, AppLoading } from 'expo';
import { Image } from 'react-native';

import Router from './routes'
import store from './redux/store';
import * as img from './assets/images';

function cacheFonts(fonts) {
    return fonts.map(function (font) { return Font.loadAsync(font) });
}

function cacheImages(images) {
    return images.map(image => {
        if (typeof image === 'string') {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
}

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            isReady: false,
        }
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
    }

    async _loadAssetsAsync() {
        const fontAssets = cacheFonts([
            { RobotoBlack: require('./assets/fonts/Roboto-Black.ttf') },
            { RobotoBold: require('./assets/fonts/Roboto-Bold.ttf') },
            { RobotoBoldItalic: require('./assets/fonts/Roboto-BoldItalic.ttf') },
            { RobotoMedium: require('./assets/fonts/Roboto-Medium.ttf') },
            { RobotoRegular: require('./assets/fonts/Roboto-Regular.ttf') },
            { RobotoLight: require('./assets/fonts/Roboto-Light.ttf') },
            { "Material Icons": require('./node_modules/@expo/vector-icons/fonts/MaterialIcons.ttf') },
            { "Material Design Icons": require('./node_modules/@expo/vector-icons/fonts/MaterialCommunityIcons.ttf') },
            { "FontAwesome": require('./node_modules/@expo/vector-icons/fonts/FontAwesome.ttf') },
            { "MaterialIcons": require('./node_modules/@expo/vector-icons/fonts/MaterialIcons.ttf') },
            { "MaterialCommunityIcons": require('./node_modules/@expo/vector-icons/fonts/MaterialCommunityIcons.ttf') }
        ]);

        const imageAssets = cacheImages([
            img.Approval,
            img.Avatar,
            img.DOCustomer,
            img.FAQ,
            img.Information,
            img.InformationWhite,
            img.Link,
            img.LinkWhite,
            img.Logo,
            img.MyConfirmation,
            img.MyRequest,
            img.Sidebar,
            img.Test,
            img.UserManual,
            img.ViewRequest
        ]);

        await Promise.all([...imageAssets, ...fontAssets]);
    }

    render() {
        if (!this.state.isReady) {
            return (
                <AppLoading
                    startAsync={this._loadAssetsAsync}
                    onFinish={() => this.setState({ isReady: true })}
                    onError={console.warn}
                />
            );
        }
        //console.disableYellowBox = true;
        return (
            <Provider store={store}>
                <Router />
            </Provider>
        );
    }
}
