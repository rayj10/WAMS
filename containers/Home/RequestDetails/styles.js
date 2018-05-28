import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, windowHeight, normalize } from '../../../theme/baseTheme';


const resizeMode = 'contain';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.dark_blue,
    flexDirection: 'column'
  },

  headerText: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.medium,
    color: color.white,
    padding:10
  },

  headerOuterContainer: {
    backgroundColor: color.dark_blue,
    height:75,
    padding:0,
    borderBottomWidth: 0,
  },

  bodyContainer: {
    flex: 1,
    backgroundColor:color.white,
    padding: 3
  },

  requestHead: {
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderColor: color.grey,
    borderBottomWidth: 1,
    borderWidth: 2
  },

  subRequestHead: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginRight: 3
  },

  requestBody: {
    borderColor: color.grey,
    borderTopWidth: 1,
    borderWidth: 2,
    padding:2
  },

  itemPanel: {
    height: 0.425*windowHeight,
    justifyContent: 'space-evenly',
    borderColor: color.light_grey,
    borderBottomWidth: 1,
    marginLeft: 1,
    marginRight: 1
  },

  verticalSubPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  horizontalSubPanel: {
    flex: 1,
    justifyContent: 'space-around',
    marginRight: 3
  },

  titleTextStyle: {
    flex: 1,
    marginTop: 3,
    fontSize: fontSize.small,
    fontFamily: fontFamily.bold,
    marginLeft: 15
  },

  textStyle: {
    flex: 2,
    marginTop:3,
    fontSize: fontSize.small,
    fontFamily: fontFamily.light,
    marginLeft: 15 
  },

  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent:'space-evenly',
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1.5,
    borderColor: color.light_grey,
    height: 0.12*windowHeight,
    backgroundColor:color.white
  },

  button: {
    flex:1,
    justifyContent:'center'
  },

  buttonText: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.medium
  },

  forwardListItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: color.light_grey,
    borderRadius: 2,
    justifyContent:'center',
    height:35
  },

  forwardListText: {
    fontSize: fontSize.small,
    fontFamily: fontFamily.medium,
    marginLeft: 10
  },

  activeItem:{
    backgroundColor:'rgba(0,102,178,0.2)'   //color.blue with opacity adjusted,
  }
});

export default styles;
