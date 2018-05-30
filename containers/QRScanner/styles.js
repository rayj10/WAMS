import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../theme/baseTheme';

const styles = StyleSheet.create({
  container:{
    flex:1
  },

  subheader:{
    fontFamily: fontFamily.medium,
    fontSize: fontSize.large-2,
    marginTop: 20,
    marginHorizontal: 20
  },

  buttonContainer:{
    flex:1,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal:20,
    marginVertical: 20,
    borderColor: color.light_grey
  },

  button:{
    marginTop:20
  },

  buttonText: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.medium
  },
});

export default styles;
