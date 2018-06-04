import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../../theme/baseTheme';

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  content:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },
  
  buttonContainer:{
    position: 'absolute',
    height: 40,
    width: windowWidth,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .5)'
  },

  backButton:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  backText:{
    fontFamily: fontFamily.medium,
    fontSize: fontSize.regular + 4,
    paddingLeft: 5,
    paddingBottom: 4
  }
});

export default styles;
