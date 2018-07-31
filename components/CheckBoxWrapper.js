import React from 'react';
import { CheckBox } from 'react-native-elements';
import { View } from 'react-native';

import { color, normalize } from '../theme/baseTheme';

class CheckBoxWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: false
        }
    }

    render() {
        return (
            <View style={this.props.style} >
                <CheckBox
                    center
                    containerStyle={{ flex: 0.6, margin: 0, borderWidth: 0, backgroundColor: color.background }}
                    size={normalize(18)}
                    title={this.props.title}
                    checked={this.state.checked}
                    onPress={() => {
                        this.setState({ checked: !this.state.checked });
                        this.props.onCheck()
                    }}
                />
            </View>
        );
    }
}

export default CheckBoxWrapper;
