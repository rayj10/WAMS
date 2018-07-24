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
    marginBottom: normalize(30),
    marginTop: normalize(5),
    marginHorizontal: normalize(15)
  },

  outterPanel: {
    height: normalize(170),
    flexDirection: 'row',
    borderColor: color.light_grey,
    borderRadius: 3,
    borderWidth: 1.5,
    marginVertical: 2
  },

  innerPanel: {
    flex: 1,
    justifyContent: 'space-evenly'
  },

  itemName: {
    fontSize: fontSize.regular,
    fontFamily: fontFamily.boldItalic,
  },

  titleTextStyle: {
    fontSize: fontSize.small + 1,
    fontFamily: fontFamily.bold,
  },

  textStyle: {
    fontSize: fontSize.small + 1,
    fontFamily: fontFamily.light,
  }
});

export default styles;
