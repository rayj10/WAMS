import React from 'react';
import { CheckBox } from 'react-native-elements';
import { View } from 'react-native';

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
                    containerStyle={{ height: 20, margin:0 }}
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
