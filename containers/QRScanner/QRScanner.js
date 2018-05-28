import React from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Header, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import Scanner from '../../components/Scanner';
import styles from './styles';

class QRScanner extends React.Component {
  render() {
    return (
        <Scanner/>
    );
  }
}

export default QRScanner;
