import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../theme/baseTheme';

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop:20,
    paddingBottom:20,
    paddingLeft:10,
    paddingRight:10,
  },

  accordionContainer:{
    marginBottom: 10,
    marginLeft:10,
    marginRight:10,
  },

  headerContainer:{
    borderBottomWidth:2,
    borderColor:color.blue,
    marginLeft:10,
    marginRight:10,
    marginBottom:10,
    marginTop:10
  },

  headerText:{
    fontFamily: fontFamily.bold,
    fontSize: fontSize.large
  }
});

export default styles;
