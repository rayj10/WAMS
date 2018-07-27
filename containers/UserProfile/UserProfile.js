import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './styles';
import { color } from '../../theme/baseTheme';
import * as authActions from '../../actions/authActions';
import IconWrapper from '../../components/IconWrapper';
import PageHeader from '../../components/Header';

//Maps store's state to UserProfile's props
export const mapStateToProps = state => ({
  userDetails: state.authReducer.userDetails,
  userDetailsReceived: state.authReducer.userDetailsReceived,
});

//Maps actions to UserProfile's props
export const mapDispatchToProps = (dispatch) => ({
  actionsAuth: bindActionCreators(authActions, dispatch),
});

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profilePic: this.props.profilePic,
      details: null
    }

    this.pictureTaken = this.pictureTaken.bind(this);
  }

  componentDidMount() {
    this.props.actionsAuth.getIntranetDetails(this.props.userDetails.Empl_id, (details) => this.setState({ details }))
  }

  /**
     * Callback to be executed once the picture's taken
     * @param {String} img: Base64 encoded string representation of the jpeg taken from the phone's camera 
     */
  pictureTaken(img) {
    this.setState({ profilePic: { uri: 'data:image/jpg;base64,' + img } });
    this.props.pictureTaken({ uri: 'data:image/jpg;base64,' + img });
    Alert.alert('Successful!', 'Profile Picture has been successfully updated');
    Actions.pop();
  }

  render() {
    let { details } = this.state;

    return (
      <View style={styles.container}>
        <PageHeader
          left={<IconWrapper name='chevron-left' type='font-awesome' color='white' size={28} style={styles.icon} onPress={() => Actions.pop()} />}
          title={'User Profile'}
          right={<View style={{ width: 38 }} />} />
        <View style={styles.profilePic}>
          <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => Actions.TakePhoto({ pictureTaken: this.pictureTaken, useMsg: 'Set as Profile Picture' })}>
            <Image source={this.state.profilePic} style={styles.avatar} />
            <Text style={styles.editText}> Edit </Text>
          </TouchableOpacity>
          <Text style={styles.name}>{this.props.userDetails.DisplayName}</Text>
        </View>
        <View style={styles.bodyContainer}>
          {
            details ?
              <ScrollView>
                <Icon name='work' color={color.light_grey} size={30}/>
                <Text style={styles.titleTextStyle}>Division</Text>
                <View style={styles.dataContainer}>
                  <Text style={styles.textStyle}>{details.DIVISION_NAME}</Text>
                </View>
                <Text style={styles.titleTextStyle}>Position</Text>
                <View style={styles.dataContainer}>
                  <Text style={styles.textStyle}>{details.OFF_POSITION}</Text>
                </View>
                <Text style={styles.titleTextStyle}>Status</Text>
                <View style={styles.dataContainer}>
                  <Text style={styles.textStyle}>{details.EMPLOYEE_STATUS}</Text>
                </View>
                <Text style={styles.titleTextStyle}>Sign-in Date</Text>
                <View style={styles.dataContainer}>
                  <Text style={styles.textStyle}>{details.SIGNIN}</Text>
                </View>
                <Icon name='person' color={color.light_grey} size={32}/>
                <Text style={styles.titleTextStyle}>Email 1</Text>
                <View style={styles.dataContainer}>
                  <Text style={styles.textStyle}>{details.EMAIL}</Text>
                </View>
                <Text style={styles.titleTextStyle}>Email 2</Text>
                <View style={styles.dataContainer}>
                  <Text style={styles.textStyle}>{details.EMAIL2}</Text>
                </View>
                <Text style={styles.titleTextStyle}>Phone 1</Text>
                <View style={styles.dataContainer}>
                  <Text style={styles.textStyle}>{details.HANDPHONE}</Text>
                </View>
                <Text style={styles.titleTextStyle}>Phone 2</Text>
                <View style={styles.dataContainer}>
                  <Text style={styles.textStyle}>{details.HANDPHONE2}</Text>
                </View>
              </ScrollView>
              :
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.textStyle}> Details Unavalable </Text>
              </View>
          }
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
