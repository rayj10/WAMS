import React from 'react';
import { Provider } from 'react-redux';
import { Font, AppLoading } from 'expo';

import Router from './routes'
import store from './redux/store';

function cacheFonts(fonts) {
    return fonts.map(function(font) {return Font.loadAsync(font)});
}

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            isReady: false,
        }
    }

    async _loadAssetsAsync() {
        const fontAssets = cacheFonts([
            {RobotoBlack: require('./assets/fonts/Roboto-Black.ttf')},
            {RobotoBold: require('./assets/fonts/Roboto-Bold.ttf')},
            {RobotoMedium: require('./assets/fonts/Roboto-Medium.ttf')},
            {RobotoRegular: require('./assets/fonts/Roboto-Regular.ttf')},
            {RobotoLight: require('./assets/fonts/Roboto-Light.ttf')}
        ]);

        await Promise.all([...fontAssets]);
    }

    render() {
        if (!this.state.isReady) {
            return (
                <AppLoading
                    startAsync={this._loadAssetsAsync}
                    onFinish={() => this.setState({isReady: true})}
                    onError={console.warn}
                />
            );
        }
        console.disableYellowBox = true;
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP);
        return (
            <Provider store={store}>
                    <Router/>
            </Provider>
        );
    }
}
