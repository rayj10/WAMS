import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Picker, Platform, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import { normalize, windowWidth, fontFamily, color, windowHeight } from '../theme/baseTheme';
import IconWrapper from './IconWrapper';

class PickerWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verification: this.props.items[0],
            modal: false,
        }
    }

    render() {
        let picker;

        let iosPickerModal = (
            <Modal isVisible={this.state.modal} hideModalContentWhileAnimating={true} backdropColor={color.white} backdropOpacity={0.9} animationIn="zoomInDown" animationOut="zoomOutUp" animationInTiming={200} animationOutTiming={200} onBackButtonPress={() => this.setState({ modal: false })} onBackdropPress={() => this.setState({ modal: false })} >
                <View style={{ backgroundColor: color.white, width: 0.9 * windowWidth, height: 0.3 * windowHeight, justifyContent: 'center' }}>
                    <Picker
                        selectedValue={this.state.verification}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({ verification: itemValue });
                            this.setState({ modal: false });
                            setTimeout(() => this.props.onSelect(itemValue), 1200);
                        }}
                    >
                        {this.props.items.map((item, key) => <Picker.Item label={item} value={item} key={key} />)}
                    </Picker>
                </View>
            </Modal>);

        if (Platform.OS === 'ios')
            return (
                <View style={[this.props.style]}>
                    {iosPickerModal}
                    <TouchableOpacity onPress={() => this.setState({ modal: true })}>
                        <View style={{ flexDirection: 'row', width: 0.3 * windowWidth, height: normalize(25), borderWidth: 1, borderColor: color.light_grey, marginLeft: normalize(10), justifyContent: 'space-around', alignItems: 'center', borderRadius: 4 }}>
                            <Text style={{ fontFamily: fontFamily.regular }}> {this.state.verification}</Text>
                            <IconWrapper name='md-arrow-dropdown' type='ionicon' color={color.light_grey} size={20} onPress={() => this.setState({ modal: true })} />
                        </View>
                    </TouchableOpacity>
                </View >);
        else
            return (
                <View style={this.props.style} >
                    <Picker
                        selectedValue={this.state.verification}
                        style={{ height: normalize(20), width: normalize(150) }}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({ verification: itemValue });
                            this.props.onSelect(itemValue);
                        }}
                    >
                        {this.props.items.map((item, key) => <Picker.Item label={item} value={item} key={key} />)}
                    </Picker>
                </View>);
    }
}

PickerWrapper.propTypes = {
    items: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
}

export default PickerWrapper;