import React from 'react';
import { View, Alert, Text, TouchableOpacity, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import Scanner from '../../../components/Scanner';
import DialogBoxModal from '../../../components/DialogBoxModal';
import styles from './styles';
import { color } from '../../../theme/baseTheme';
import menuInfo from '../../../json/menuInfo.json';

class ScanPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      torchOn: false,
      data: null,
      dialog: false,
      onCancel: null
    }

    this.onBarcodeRead = this.onBarcodeRead.bind(this);
  }

  /**
   * Add hyperlinks to String and by making them into an array of touchable objects if they satify the regex
   * @param {String} input: String to be formatted 
   */
  formatString(input) {
    let webUrl = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
    let email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i

    let jsString = [];
    let str = "";

    input.split(" ").forEach((item, key) => {
      let isWeb = webUrl.test(item), isEmail = email.test(item);
      if (isWeb || isEmail) {
        let protocol = "http://";
        if (isEmail)
          protocol = "mailto:";

        let prefix = item.split(":")[0]
        if (prefix === "http" || prefix === "https" || prefix === "ftp" || prefix === "mailto")
          protocol = "";

        if (str !== ""){
          jsString.push(
            <View key={key} style={{ flexDirection: 'row' }}>
              <Text style={styles.textStyle}>{str} </Text>
              <TouchableOpacity onPress={() => Linking.openURL(protocol + item)}>
                <Text style={style = [styles.textStyle, { textDecorationLine: 'underline', color: color.light_blue }]}>{item}</Text>
              </TouchableOpacity>
            </View>
          );
        }
        else{
          jsString.push(<TouchableOpacity key={key} onPress={() => Linking.openURL(protocol + item)}>
            <Text style={style = [styles.textStyle, { textDecorationLine: 'underline', color: color.light_blue }]}>{item}</Text>
          </TouchableOpacity>);
        }
        str = "";
      }
      else if (item === "\n" && str !== "") {
        jsString.push(<Text key={key} style={styles.textStyle}>{str}</Text>);
        str = "";
      }
      else if (item !== "\n" && item !== "")
        str += item + " ";
    });

    if (str !== "")
      jsString.push(<Text key={input.split(" ").length} style={styles.textStyle}>{str}</Text>);
    return jsString;
  }

  /**
   * Callback to be executed once Scanner picks up something
   * @param {String} type: Type of barcode read 
   * @param {String} data: Content of the barcode 
   * @param {Function} onCancel: Callback to be executed if user chooses to cancel on the reading  
   */
  onBarcodeRead(type, data, onCancel) {
    if (this.props.type === menuInfo.Constants.INFORMATION) {
      Alert.alert(
        'A ' + type + ' has been found',
        'Content:\n' + data,
        [{ text: 'Scan another', onPress: onCancel }]
      );
    }
    else if (this.props.type === menuInfo.Constants.LINK) {
      this.setState({
        data: this.formatString(data),
        dialog: true,
        onCancel
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.dialog ? <DialogBoxModal
          visible={this.state.dialog}
          title={"Click on a URL to open: "}
          content={this.state.data}
          buttons={[
            {
              text: "Scan another", onPress: () => {
                this.setState({ dialog: false });
                this.state.onCancel();
              }
            }
          ]}
        /> : null
        }
        <Scanner
          onRead={this.onBarcodeRead}
          torch={this.state.torchOn} />
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.pop()}>
            <View style={styles.backButton}>
              <Icon name='action-undo' type='simple-line-icon' size={40} color='white' />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.torchButtonContainer}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ torchOn: !this.state.torchOn })}>
            <View style={styles.torchButton}>
              {
                this.state.torchOn ?
                  <Icon name='flashlight-off' type='material-community' size={40} color='white' />
                  :
                  <Icon name='flashlight' type='material-community' size={40} color='white' />
              }
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default ScanPage;
