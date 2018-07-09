import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import styles from './styles';
import { Link, Information } from '../../assets/images';
import * as links from '../../utils/links';

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
            this.props.menuReceived ? this.props.menuList.find((item) => item['MenuID'] === links.ID.QRSCANNER)['Children'].map((item, key) => {
              return (
                <View style={styles.buttonContainer} key={key}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.jump("ScanPage", { type: item['MenuID'] })}>
                    <View style={styles.button}>
                      <Image style={styles.image} source={links.IDtoIcon(item['MenuID'])} />
                      <Text style={styles.buttonText}> {links.IDtoName(item['MenuID'])} </Text>
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
