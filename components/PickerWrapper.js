import React from 'react';
import PropTypes from 'prop-types';
import { View, Picker } from 'react-native';

import { normalize } from '../theme/baseTheme';

class PickerWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verification: null
        }
    }

    render() {
        return (
            <View style={this.props.style}>
                <Picker
                    selectedValue={this.state.verification}
                    style={{ height: normalize(20), width: normalize(100) }}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ verification: itemValue });
                        this.props.onSelect(itemValue);
                    }}
                >
                    <Picker.Item label={'- Select -'} value={null}/>
                    {this.props.items.map((item, key) => <Picker.Item label={item} value={item} key={key} />)}
                </Picker>
            </View>
        );
    }
}

PickerWrapper.propTypes = {
    items: PropTypes.array.isRequired,
}

export default PickerWrapper;