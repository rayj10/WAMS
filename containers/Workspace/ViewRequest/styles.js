import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white
  },

  pages: {
    marginBottom: normalize(20)
  }
});

export default styles;
