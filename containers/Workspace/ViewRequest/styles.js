import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingBottom:20
  },

  subHeader: {
    fontSize: fontSize.large-6,
    fontFamily: fontFamily.bold,
    color: color.light_black,
    marginLeft: 30,
    marginTop: 30,
    marginBottom: 10,
  },

  panelContainer: {
    flex: 1,
    marginLeft: 30,
    marginRight: 30,
    marginBottom:60,
    borderColor: color.grey,
    borderRadius: 2,
    borderWidth: 2
  },

  dataPanel: {
    justifyContent: "center",
    height: normalize(75),
    borderColor: color.light_grey,
    borderRadius: 3,
    borderWidth: 1.5,
    marginLeft: 1,
    marginRight: 1
  },

  titleTextStyle: {
    fontSize: fontSize.small - 2,
    fontFamily: fontFamily.bold,
  },

  textStyle: {
    flex: 1,
    fontSize: fontSize.small - 2,
    fontFamily: fontFamily.light,
  }
});

export default styles;
