import { StyleSheet } from 'react-native';
import { color, normalize } from '../../../theme/baseTheme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
    paddingVertical: normalize(10)
  }
});

export default styles;
