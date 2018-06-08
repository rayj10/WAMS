import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingVertical: normalize(10)
  },

  pageIndicator: {
    paddingBottom: normalize(10),
    paddingTop: 0
  }
});

export default styles;
