import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import Accordion from '../../../components/Accordion';
import styles from './styles';

class UserManual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaceTabs: [],
      workspaceIndex: 0
    }
  }

  componentDidMount() {
    let menu = this.getMenu();
    this.setState({ workspaceTabs: menu });
  }

  /**
     * Fetch a list of menus available for the user
     */
  getMenu() {
    return ["Approval", "My Request", "DO Customer", "My Confirm", "View Request"];
  }

  mapTabsToManuals(list) {
    return list.map((item, key) => {
      let text = "Lorem ipsum dolor sit amet, cu verear facilisi vel, soleat menandri mnesarchum in sed. Ex nullam blandit sententiae vix. Cum simul euripidis eu, ea malis oporteat delicatissimi quo, eam in menandri consequat philosophia. Fuisset oporteat pri at, tollit nostrum fierent nec id, eum ad solum detracto. Ex vel verear quaerendum.\n\nMalorum quaerendum ea vim, mel movet partem persecuti et, cu iudico impetus persius sea. Eos falli suscipit accommodare cu. Eam id sanctus albucius, agam facilisi interpretaris ei qui. Usu tamquam maiestatis delicatissimi et. Quo id detraxit reprehendunt, ex his accommodare complectitur.\n\nAd his ferri utroque accusata. Id nam elit decore vivendum. Per solet iuvaret fierent et, diam idque at mea. Vix cu saepe vituperatoribus. Mea nostrud deleniti in. Prompta consequat voluptaria ne eam, no wisi augue vis.\n\nNo qui mollis singulis partiendo. Odio dolorum splendide ut sit, sea in vivendum mediocrem voluptatum, in vim ferri nostro discere. Vim soleat doctus mentitum ut, ut eos decore reprimique consectetuer. Idque constituto mei an, per ei debitis eligendi. Eum ea omnis atomorum aliquando, nam te offendit ocurreret, at mea nusquam docendi.\n\nPro ad probo corpora, vocent dolores mel id, pri assum erroribus no. Oratio tantas ne quo. Cu purto duis nam, ei vix facer moderatius, at sumo neglegentur per. Ea recteque electram eos, sea dicant nullam ex, eu indoctum referrentur eam.";
      let source = "";

      switch (item) {
        case 'Approval': source = require('../../../assets/images/Approval.png'); break;
        case 'My Request': source = require('../../../assets/images/MyRequest.png'); break;
        case 'DO Customer': source = require('../../../assets/images/DOCustomer.png'); break;
        case 'My Confirm': source = require('../../../assets/images/MyConfirm.png'); break;
        case 'View Request': source = require('../../../assets/images/ViewRequest.png'); break;
        case 'Scan Link': source = require('../../../assets/images/LinkWhite.png'); break;
        case 'Scan Information': source = require('../../../assets/images/InformationWhite.png'); break;
      }

      return {
        image: source,
        title: item,
        content: text
      }
    });
  }

  getCarousel(title) {
    let manuals = "";

    if (title === 'Workspace')
      manuals = this.mapTabsToManuals(this.state.workspaceTabs);
    else if (title === 'QR Scanner')
      manuals = this.mapTabsToManuals(['Scan Link', 'Scan Information']);

    return <Carousel
      data={manuals}
      renderItem={({ item, index }) => {
        return (
          <View style={styles.manualContainer}>
            <View style={styles.manualHeader}>
              <Image style={styles.manualImage} source={item.image} />
            </View>
            <View style={styles.manualBody}>
              <Text style={styles.manualTitle}>{item.title}</Text>
              <Text style={styles.manualContent}>{item.content}</Text>
            </View>
          </View>
        );
      }}
      sliderWidth={400}
      itemWidth={300}
    />
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>User Manual</Text>
          </View>
          <View style={styles.accordionContainer}>
            <Accordion title={'Workspace'} body={this.getCarousel('Workspace')} />
          </View>
          <View style={styles.accordionContainer}>
            <Accordion title={'QR Scanner'} body={this.getCarousel('QR Scanner')} />
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.pop()}>
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
