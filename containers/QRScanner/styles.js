import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  subheader: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.large - 2,
    marginTop: normalize(20),
    marginHorizontal: normalize(20)
  },

  buttonContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: normalize(8),
    marginHorizontal: normalize(20),
    marginVertical: normalize(20),
    borderColor: color.light_grey
  },

  button: {
    marginTop: normalize(20)
  },

  buttonText: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.medium
  },
});

export default styles;
