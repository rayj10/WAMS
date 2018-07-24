import { StyleSheet } from 'react-native';
import { normalize, fontFamily, fontSize } from '../../../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  textStyle: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.light,
    marginLeft: normalize(10)
  },

  backButtonContainer: {
    position: 'absolute',
    bottom: 0,
    height: normalize(60),
    width: normalize(60),
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderTopEndRadius: 10
  },

  backButton: {
    position: 'absolute',
    bottom: 0,
    height: normalize(55),
    width: normalize(55),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .3)',
    borderTopEndRadius: 5
  },

  torchButtonContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: normalize(60),
    width: normalize(60),
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderTopStartRadius: 10
  },

  torchButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: normalize(55),
    width: normalize(55),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .3)',
    borderTopStartRadius: 5
  }
});

export default styles;
