import { StyleSheet } from 'react-native';
import { color, fontSize, fontFamily, normalize } from '../../../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    paddingVertical: normalize(10)
  },

  subHeader: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.bold,
    color: color.light_black,
    marginHorizontal: normalize(15)
  },

  panelContainer: {
    flex: 1,
    marginTop: normalize(5),
    marginHorizontal: normalize(15)
  },

  outterPanel: {
    flex: 1,
    height: normalize(75),
    flexDirection: 'row',
    borderColor: color.light_grey,
    borderRadius: 3,
    borderWidth: 1.5,
    marginVertical: 2
  },

  innerPanel: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: normalize(2)
  },

  itemName: {
    fontSize: fontSize.regular,
    fontFamily: fontFamily.boldItalic,
  },

  textStyle: {
    fontSize: fontSize.small + 1,
    fontFamily: fontFamily.bold,
  },

  titleTextStyle: {
    fontSize: fontSize.small + 1,
    fontFamily: fontFamily.regular,
  }
});

export default styles;
