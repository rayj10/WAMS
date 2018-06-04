import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';

import Accordion from '../../../components/Accordion';
import styles from './styles';

class UserManual extends React.Component {
  render() {
    let header = "Lorem Ipsum";
    let content = "Lorem ipsum dolor sit amet, cu verear facilisi vel, soleat menandri mnesarchum in sed. Ex nullam blandit sententiae vix. Cum simul euripidis eu, ea malis oporteat delicatissimi quo, eam in menandri consequat philosophia. Fuisset oporteat pri at, tollit nostrum fierent nec id, eum ad solum detracto. Ex vel verear quaerendum.\n\nMalorum quaerendum ea vim, mel movet partem persecuti et, cu iudico impetus persius sea. Eos falli suscipit accommodare cu. Eam id sanctus albucius, agam facilisi interpretaris ei qui. Usu tamquam maiestatis delicatissimi et. Quo id detraxit reprehendunt, ex his accommodare complectitur.\n\nAd his ferri utroque accusata. Id nam elit decore vivendum. Per solet iuvaret fierent et, diam idque at mea. Vix cu saepe vituperatoribus. Mea nostrud deleniti in. Prompta consequat voluptaria ne eam, no wisi augue vis.\n\nNo qui mollis singulis partiendo. Odio dolorum splendide ut sit, sea in vivendum mediocrem voluptatum, in vim ferri nostro discere. Vim soleat doctus mentitum ut, ut eos decore reprimique consectetuer. Idque constituto mei an, per ei debitis eligendi. Eum ea omnis atomorum aliquando, nam te offendit ocurreret, at mea nusquam docendi.\n\nPro ad probo corpora, vocent dolores mel id, pri assum erroribus no. Oratio tantas ne quo. Cu purto duis nam, ei vix facer moderatius, at sumo neglegentur per. Ea recteque electram eos, sea dicant nullam ex, eu indoctum referrentur eam.";

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Header 1</Text>
          </View>
          <View style={styles.accordionContainer}>
            <Accordion title={header} body={content} />
          </View>
          <View style={styles.accordionContainer}>
            <Accordion title={header} body={content} />
          </View>
          <View style={styles.accordionContainer}>
            <Accordion title={header} body={content} />
          </View>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Header 2</Text>
          </View>
          <View style={styles.accordionContainer}>
            <Accordion title={header} body={content} />
          </View>
          <View style={styles.accordionContainer}>
            <Accordion title={header} body={content} />
          </View>
          <View style={styles.accordionContainer}>
            <Accordion title={header} body={content} />
          </View>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Header 3</Text>
          </View>
          <View style={styles.accordionContainer}>
            <Accordion title={header} body={content} />
          </View>
          <View style={styles.accordionContainer}>
            <Accordion title={header} body={content} />
          </View>
          <View style={styles.accordionContainer}>
            <Accordion title={header} body={content} />
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{flex:1}} onPress={() => Actions.pop()}>
            <View style={styles.backButton}>
              <Icon name='chevron-left' type='font-awesome' size={24} />
              <Text style={styles.backText}> Back </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default UserManual;
