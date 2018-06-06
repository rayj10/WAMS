import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  headerContainer: {
    borderBottomWidth: 2,
    borderColor: color.blue,
    marginHorizontal: normalize(10),
    marginVertical: normalize(15),
  },

  headerText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.large
  },

  accordionContainer: {
    marginVertical: normalize(10),
    marginHorizontal: normalize(10)
  },

  manualContainer: {
    flex: 1,
    marginVertical: normalize(10),
  },

  manualHeader: {
    height: normalize(110),
    backgroundColor: color.light_blue,
    borderTopRightRadius: normalize(20),
    borderTopLeftRadius: normalize(20),
    alignItems: 'center'
  },

  manualImage: {
    height: normalize(80),
    width: normalize(80),
    resizeMode: 'contain',
    marginVertical: normalize(15)
  },

  manualBody: {
    flex: 3,
    borderBottomRightRadius: normalize(20),
    borderBottomLeftRadius: normalize(20),
    backgroundColor: color.white
  },

  manualTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.large,
    alignSelf: 'center',
    marginVertical: normalize(15)
  },

  manualContent: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.regular,
    textAlign: 'justify',
    marginBottom: normalize(15),
    marginHorizontal: normalize(15)
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 0,    
    height: normalize(60),
    width: normalize(60),
    backgroundColor: 'rgba(0, 0, 0, .4)',
    borderTopEndRadius: normalize(10)
  },

  backButton: {
    position: 'absolute',
    bottom: 0, 
    height: normalize(57),
    width: normalize(57),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    borderTopEndRadius: normalize(7)
  }
});

export default styles;
