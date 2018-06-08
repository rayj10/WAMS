import React from 'react';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';

import { normalize } from '../theme/baseTheme';

const IconWrapper = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}>
            <View style={props.style}>
                <Icon name={props.name} type={props.type} color={props.color} size={props.size} />
            </View>
        </TouchableOpacity>
    );
}

IconWrapper.propTypes = {
    onPress: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    color: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired
}

export default IconWrapper;