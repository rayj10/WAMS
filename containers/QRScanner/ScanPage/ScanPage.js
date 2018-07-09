import React from 'react';
import { View, Alert, Text, TouchableOpacity, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import Scanner from '../../../components/Scanner';
import DialogBoxModal from '../../../components/DialogBoxModal';
import styles from './styles';
import { ID } from '../../../utils/links';
import { color } from '../../../theme/baseTheme';

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

  formatString(input) {
    let regex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;

    let jsString = [];
    let str = "";

    input.split(" ").forEach((item, key) => {
      if (regex.test(item)) {
        let protocol = "http://";
        if (item.split("://")[0] === "http" || item.split("://")[0] === "https")
          protocol = "";

        if (str !== "")
          jsString.push(
            <View key={key} style={{ flexDirection: 'row' }}>
              <Text style={styles.textStyle}>{str} </Text>
              <TouchableOpacity onPress={() => Linking.openURL(protocol + item)}>
                <Text style={style = [styles.textStyle, { textDecorationLine: 'underline', color: color.light_blue }]}>{item}</Text>
              </TouchableOpacity>
            </View>
          );
        else
          jsString.push(<TouchableOpacity key={key} onPress={() => Linking.openURL(protocol + item)}>
            <Text style={style = [styles.textStyle, { textDecorationLine: 'underline', color: color.light_blue }]}>{item}</Text>
          </TouchableOpacity>);
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
      jsString.push(<Text key={jsString.length} style={styles.textStyle}>{str}</Text>);

    return jsString;
  }

  onBarcodeRead(type, data, onCancel) {
    if (this.props.type === ID.INFORMATION) {
      Alert.alert(
        'A ' + type + ' has been found',
        'Content:\n' + data,
        [{ text: 'Scan another', onPress: onCancel }]
      );
    }
    else if (this.props.type === ID.LINK) {
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
          torch={this.state.torchOn ? 'on' : 'off'} />
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
