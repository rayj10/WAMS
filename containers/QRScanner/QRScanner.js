import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import styles from './styles';
import { getIcon } from '../../assets/images';
import menuInfo from '../../json/menuInfo.json';

//Maps store's state to Approval's props
export const mapStateToProps = state => ({
  menuList: state.menuReducer.menuList,
  menuReceived: state.menuReducer.menuReceived,
});

class QRScanner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.subheader}>
          What would you like to scan?
        </Text>
        <View style={styles.body}>
          {
            this.props.menuReceived ? this.props.menuList.find((item) => item['MenuID'] === menuInfo.Constants.QRSCANNER)['Children'].map((item, key) => {
              return (
                <View style={styles.buttonContainer} key={key}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.jump("ScanPage", { type: item['MenuID'] })}>
                    <View style={styles.button}>
                      <Image style={styles.image} source={getIcon(item['MenuID'])} />
                      <Text style={styles.buttonText}> {menuInfo[item['MenuID']].name} </Text>
                    </View>
                  </TouchableOpacity>
                </View>);
            }) : null
          }
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(QRScanner);
