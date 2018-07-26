import { StyleSheet } from 'react-native';
import { color, fontSize, fontFamily, windowHeight, normalize } from '../../../theme/baseTheme';

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
    backgroundColor: color.background,
    padding: normalize(3)
  },

  requestHead: {
    height: normalize(200),
    borderColor: color.grey,
    borderBottomWidth: 1,
    borderWidth: 2,
    paddingBottom: normalize(3)
  },

  horizontalSubRequestHead: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },

  verticalSubRequestHead: {
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
    height: 0.425 * windowHeight,
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
    justifyContent: 'space-around',
    marginRight: normalize(3)
  },

  textStyle: {
    flex: 2,
    marginTop: normalize(3),
    fontSize: fontSize.small,
    fontFamily: fontFamily.bold,
    marginLeft: normalize(15)
  },

  titleTextStyle: {
    flex: 1,
    marginTop: normalize(3),
    fontSize: fontSize.small,
    fontFamily: fontFamily.regular,
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
    backgroundColor: color.background
  },

  button: {
    flex: 1,
    justifyContent: 'center'
  },

  buttonText: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.medium
  },

  priceSumRow: {
    flex: 1
  },

  priceSumData: {
    flex: 1.5,
    marginTop: normalize(3),
    fontSize: fontSize.regular,
    fontFamily: fontFamily.bold,
  },

  priceSumKeys: {
    flex: 1,
    marginTop: normalize(3),
    fontSize: fontSize.regular,
    fontFamily: fontFamily.regular
  },
});

export default styles;
