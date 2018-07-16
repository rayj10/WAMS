/**
 * Declare our font sizes, colors, font family, etc for the app to refer to
 */
import { Dimensions, Platform } from 'react-native';
import { moderateScale as normalize } from 'react-native-size-matters'; //adjusts sizes based on device

const color = {
    black: "#3B3031",
    light_black: "#252930",
    main: "rgb(99,139,250)",
    white: "#fcfcfc",
    underlayColor: "#ddd",
    red: "#fc5e55",
    green: "#36f76a",
    light_grey: "#bbbdc0",
    grey: "#4b5970",
    light_blue: "#0083e7",
    blue: "#0061ac",
    dark_blue: "#004071",
    background: "#f7f7f7"
}

const fontSize = {
    small: normalize(13),
    regular: normalize(15),
    large: normalize(22)
}

const fontFamily = {
    extrabold: "RobotoBlack",
    bold: "RobotoBold",
    boldItalic: 'RobotoBoldItalic',
    medium: "RobotoMedium",
    regular: "RobotoRegular",
    light: "RobotoLight"
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export {
    color,
    fontSize,
    fontFamily,
    windowWidth,
    windowHeight,
    normalize
}
