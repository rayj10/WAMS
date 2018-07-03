import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, windowHeight, normalize } from '../../../theme/baseTheme';


const resizeMode = 'contain';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.dark_blue,
    flexDirection: 'column'
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

  bodyContainer: {
    flex: 1,
    backgroundColor: color.white,
    padding: normalize(3)
  },

  requestHead: {
    height: normalize(150),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderColor: color.grey,
    borderBottomWidth: 1,
    borderWidth: 2
  },

  subRequestHead: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginRight: normalize(3)
  },

  requestBody: {
    borderColor: color.grey,
    borderTopWidth: 1,
    borderWidth: 2,
    padding: normalize(2)
  },

  itemPanel: {
    height: 0.42 * windowHeight,
    justifyContent: 'space-evenly',
    borderColor: color.light_grey,
    borderBottomWidth: 1,
    marginHorizontal: normalize(1)
  },

  verticalSubPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  horizontalSubPanel: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginRight: normalize(3)
  },

  titleTextStyle: {
    flex: 1,
    marginTop: normalize(3),
    fontSize: fontSize.small,
    fontFamily: fontFamily.bold,
    marginLeft: normalize(15)
  },

  textStyle: {
    flex: 2,
    marginTop: normalize(3),
    fontSize: fontSize.small,
    fontFamily: fontFamily.light,
    marginLeft: normalize(15)
  },

  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderColor: color.light_grey,
    height: 0.12 * windowHeight,
    backgroundColor: color.white
  },

  button: {
    flex: 1,
    justifyContent: 'center'
  },

  buttonText: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.medium
  },

  forwardListItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: color.light_grey,
    borderRadius: normalize(2),
    justifyContent: 'center',
    height: normalize(35)
  },

  forwardListText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    marginLeft: normalize(10)
  },

  activeItem: {
    backgroundColor: 'rgba(0,102,178,0.2)'   //color.blue with opacity adjusted,
  }
});

export default styles;