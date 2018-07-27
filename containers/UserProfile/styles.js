import { StyleSheet } from 'react-native';
import { color, fontSize, fontFamily, windowWidth, normalize } from '../../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  icon: {
    marginHorizontal: 10,
    marginVertical: 10
  },

  headerText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.medium,
    color: color.white,
    padding: normalize(10)
  },

  headerOuterContainer: {
    backgroundColor: color.blue,
    height: normalize(75),
    padding: 0,
    borderBottomWidth: 0,
  },

  profilePic: {
    height: normalize(215),
    backgroundColor: '#f2f7fc',
    justifyContent: 'center',
    alignItems: 'center'
  },

  avatar: {
    height: normalize(140),
    width: normalize(140),
    borderRadius: normalize(70)
  },

  editText: {
    color: color.light_blue,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.small
  },

  name: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.large
  },

  bodyContainer: {
    flex: 1,
    paddingTop: normalize(15),
    backgroundColor: color.white
  },

  dataContainer: {
    height: normalize(40),
    justifyContent: 'center',
    backgroundColor: color.white,
    marginBottom: normalize(15)
  },

  textStyle: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.regular,
    marginLeft: normalize(15)
  },

  titleTextStyle: {
    fontSize: fontSize.regular,
    fontFamily: fontFamily.bold,
    color: color.grey,
    marginLeft: normalize(5)
  }

});

export default styles;
