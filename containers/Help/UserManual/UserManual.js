import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import Accordion from '../../../components/Accordion';
import styles from './styles';
import { windowWidth } from '../../../theme/baseTheme';
import * as menuAction from '../../../actions/menuActions';
import * as img from '../../../assets/images';
import * as links from '../../../utils/links';

//Maps store's state to Approval's props
export const mapStateToProps = state => ({
  menuList: state.menuReducer.menuList,
  menuReceived: state.menuReducer.menuReceived,
});

class UserManual extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Map list of tabs into list of Objects containing a full card information of manual
   * @param {Array} list: Tab titles 
   */
  mapTabsToManuals(list) {
    return list.map(item => {
      let text = "Lorem ipsum dolor sit amet, cu verear facilisi vel, soleat menandri mnesarchum in sed. Ex nullam blandit sententiae vix. Cum simul euripidis eu, ea malis oporteat delicatissimi quo, eam in menandri consequat philosophia. Fuisset oporteat pri at, tollit nostrum fierent nec id, eum ad solum detracto. Ex vel verear quaerendum.\n\nMalorum quaerendum ea vim, mel movet partem persecuti et, cu iudico impetus persius sea. Eos falli suscipit accommodare cu. Eam id sanctus albucius, agam facilisi interpretaris ei qui. Usu tamquam maiestatis delicatissimi et. Quo id detraxit reprehendunt, ex his accommodare complectitur.\n\nAd his ferri utroque accusata. Id nam elit decore vivendum. Per solet iuvaret fierent et, diam idque at mea. Vix cu saepe vituperatoribus. Mea nostrud deleniti in. Prompta consequat voluptaria ne eam, no wisi augue vis.\n\nNo qui mollis singulis partiendo. Odio dolorum splendide ut sit, sea in vivendum mediocrem voluptatum, in vim ferri nostro discere. Vim soleat doctus mentitum ut, ut eos decore reprimique consectetuer. Idque constituto mei an, per ei debitis eligendi. Eum ea omnis atomorum aliquando, nam te offendit ocurreret, at mea nusquam docendi.\n\nPro ad probo corpora, vocent dolores mel id, pri assum erroribus no. Oratio tantas ne quo. Cu purto duis nam, ei vix facer moderatius, at sumo neglegentur per. Ea recteque electram eos, sea dicant nullam ex, eu indoctum referrentur eam.";
      let source = links.IDtoIcon(item['MenuID'], 'white');

      return {
        image: source,
        title: links.IDtoName(item['MenuID']),
        content: text
      }
    });
  }

  /**
   * Get a carousel of cards containing tabs of menu based on title
   * @param {Object} menu: Level 1 Menu to be created a carousel from 
   */
  getCarousel(menu) {
    let sliderWidth = windowWidth - 30;
    let itemWidth = sliderWidth - 60;

    return <Carousel
      data={this.mapTabsToManuals(menu['Children'])}
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
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
    />
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>User Manual</Text>
          </View>
          {
            this.props.menuReceived ? this.props.menuList.map((item, key) => {
              if (item['MenuID'] !== links.ID.HELP)
                return (
                  <View style={styles.accordionContainer} key={key}>
                    <Accordion title={links.IDtoName(item['MenuID'])} body={this.getCarousel(item)} />
                  </View>)
            }) : null
          }
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => Actions.pop()}>
            <View style={styles.backButton}>
              <Icon name='action-undo' type='simple-line-icon' size={40} color='white' />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(UserManual);
