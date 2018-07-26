import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';

import Accordion from '../../../components/Accordion';
import styles from './styles';
import { windowWidth } from '../../../theme/baseTheme';
import menuInfo from '../../../json/menuInfo.json';
import { getIcon } from '../../../assets/images';

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
      let title = menuInfo[item['MenuID']].name;
      let content = menuInfo[item['MenuID']].manual;
      let image = getIcon(item['MenuID'], 'white');

      return {
        image,
        title,
        content
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
              if (item['MenuID'] !== menuInfo.Constants.HELP)
                return (
                  <View style={styles.accordionContainer} key={key}>
                    <Accordion title={menuInfo[item['MenuID']].name} body={this.getCarousel(item)} />
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
