import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
