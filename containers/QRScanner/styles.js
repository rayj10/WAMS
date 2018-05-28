import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../theme/baseTheme';

const styles = StyleSheet.create({
  container:{
    flex:1
  },

  button:{
    justifyContent:'center',
    marginTop: 40
  },

  buttonText: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.medium
  },
});

export default styles;
