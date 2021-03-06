import { StyleSheet } from 'react-native';
import { color, fontSize, fontFamily, windowWidth, normalize, windowHeight } from '../../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: normalize(20)
  },

  horizontalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },

  buttonContainer: {
    height: normalize(150),
    width: normalize((windowWidth - 30) / 3) < normalize(120) ? normalize((windowWidth - 30) / 3) : normalize(120),
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
