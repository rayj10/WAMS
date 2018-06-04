import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  accordionContainer: {
    marginBottom: normalize(10),
    marginHorizontal: normalize(10)
  },

  headerContainer: {
    borderBottomWidth: 2,
    borderColor: color.blue,
    marginHorizontal: normalize(10),
    marginVertical: normalize(10)
  },

  headerText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.large
  },

  buttonContainer: {
    position: 'absolute',
    height: normalize(40),
    width: windowWidth,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .5)'
  },

  backButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  backText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.regular + 4,
    paddingLeft: normalize(5),
    paddingBottom: normalize(4)
  }
});

export default styles;
