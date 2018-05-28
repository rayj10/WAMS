import React from 'react';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';

const IconWrapper = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View style={[{ padding: 10 }, props.style]}>
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