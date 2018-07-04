import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../theme/baseTheme';

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
  }
});

export default styles;
