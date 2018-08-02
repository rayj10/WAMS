import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon } from '../node_modules/react-native-elements';

import { color, fontSize, fontFamily, normalize } from '../theme/baseTheme';
import errors from '../json/errors.json';
import { img } from '../assets/images';

const styles = StyleSheet.create({
    subHeader: {
        fontSize: fontSize.large,
        fontFamily: fontFamily.bold,
        color: color.light_black,
        marginHorizontal: normalize(15)
    },

    panelContainer: {
        flex: 1,
        marginBottom: normalize(30),
        marginTop: normalize(5),
        marginHorizontal: normalize(15)
    },

    outterPanel: {
        height: normalize(75),
        flexDirection: 'row',
        borderColor: color.light_grey,
        borderRadius: 3,
        borderWidth: 1.5,
        marginVertical: 2
    },

    innerPanel: {
        flex: 1,
        justifyContent: 'space-evenly'
    },

    idNumber: {
        fontSize: fontSize.regular,
        fontFamily: fontFamily.boldItalic,
    },

    textStyle: {
        fontSize: fontSize.small + 1,
        fontFamily: fontFamily.bold,
    },

    titleTextStyle: {
        fontSize: fontSize.small + 1,
        fontFamily: fontFamily.regular,
    }
});

class MyListItem extends React.PureComponent {
    render() {
        let info = this.props.buildPanel(this.props.item);
        status = this.props.name === 'PO' || this.props.name === 'DO Customer' ? info.slice(4) : info.slice(3);
        info = this.props.name === 'PO' || this.props.name === 'DO Customer' ? info.slice(0, 4) : info.slice(0, 3);
        return (<TouchableOpacity onPress={() => this.props.onShowDetails(this.props.item)} key={this.props.index}>
            <View style={[styles.outterPanel, this.props.name === 'PO' || this.props.name === 'DO Customer' ? { height: normalize(90) } : null]}>
                <View style={[styles.innerPanel, { flex: 4 }]}>
                    {info}
                </View>
                <View style={styles.innerPanel}>
                    {status}
                </View>
            </View>
        </TouchableOpacity>)
    }
}

class SummaryListPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    /**
     * Render out clickable summary (header) panels
     * @param {Array} headers: list of header information to be rendered
     */
    renderSummary(headers) {
        return headers.map((item, key) => {
            return <MyListItem item={item} index={key} buildPanel={this.buildPanel.bind(this)} {...this.props} />
        });
    }

    /**
     * Pick out desired information from header to be rendered based on keys passed in props
     * @param {Object} item: individual header information from the mapped array in renderSummary
     */
    buildPanel(item) {
        let panel = [];
        let { keys } = this.props;

        panel.push(<Text style={{ left: 15 }} key={'no'}>
            <Text style={styles.idNumber}>{item[keys['no']]}</Text>
        </Text>);
        if (this.props.name === 'PO') {
            panel.push(<Text style={{ left: 15 }} key={'requestor'}>
                <Text style={styles.titleTextStyle}>{"Created By: "}</Text>
                <Text style={styles.textStyle}>{item[keys['requestor']]}</Text>
            </Text>);
            panel.push(<Text style={{ left: 15 }} key={'handler'}>
                <Text style={styles.titleTextStyle}>{"Last Handled: "}</Text>
                <Text style={styles.textStyle}>{item[keys['handler']]}</Text>
            </Text>);
        }
        else if (this.props.name === 'DO Customer') {
            panel.push(<Text style={{ left: 15 }} key={'giver'}>
                <Text style={styles.titleTextStyle}>{"Giver: "}</Text>
                <Text style={styles.textStyle}>{item[keys['giver']]}</Text>
            </Text>);
            panel.push(<Text style={{ left: 15 }} key={'installer'}>
                <Text style={styles.titleTextStyle}>{"Installer: "}</Text>
                <Text style={styles.textStyle}>{item[keys['installer']]}</Text>
            </Text>);
        }
        else
            panel.push(<Text style={{ left: 15 }} key={'department'}>
                <Text style={styles.titleTextStyle}>{"Department: "}</Text>
                <Text style={styles.textStyle}>{item[keys['department']]}</Text>
            </Text>);
        panel.push(<Text style={{ left: 15 }} key={'date'}>
            <Text style={styles.titleTextStyle}>{"Date: "}</Text>
            <Text style={styles.textStyle}>{item[keys['date']]}</Text>
        </Text>);

        let status = item[keys['status']];
        panel.push(<View style={{ justifyContent: 'center', alignItems: 'center' }} key={'status'}>
            <Icon name={img.formStatus[status].name} type={img.formStatus[status].type} color={img.formStatus[status].color} size={normalize(42)} />
        </View>);

        return panel;
    }

    /**
     * Fetch new data for the FlatList using callback supplied to onRefresh props
     */
    onRefresh() {
        //inside checking of this.mounted ensures that when the fetching is slow for some reason and user clicked away,
        //it wouldn't try to setState on unmounted component
        if (this.mounted)
            this.setState({ refreshing: true },
                () => this.props.onRefresh(() => this.mounted ? this.setState({ refreshing: false }) : null));
    }

    render() {
        let { status, list } = this.props;

        let content = ([
            <View style={{ marginTop: 20 }}>
                <ActivityIndicator animating={true} size='large' />
            </View>]);

        if (status !== null) {
            if (status === 'success' && list) {
                content = this.renderSummary(list);
            }
            else {
                if (!errors[status])
                    status = 'Unknown Error';
                content = ([
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.textStyle, { textAlign: 'center', fontSize: 20 }]}>{'\n\n' + errors[status].name + '\n'}</Text>
                        <Text style={[styles.textStyle, { textAlign: 'center', fontSize: 16 }]}>{errors[status].message}</Text>
                    </View>
                ]);
            }
        }

        return (
            <View style={{ flex: 1 }}>
                <Text style={styles.subHeader}>{this.props.title}</Text>
                <View style={[styles.panelContainer, status === 'success' ? {} : { backgroundColor: color.white }]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        progressViewOffset={-10}
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                        onMomentumScrollEnd={(event) => event.nativeEvent.contentOffset.y === 0 ? this.onRefresh() : null}
                        data={content}
                        renderItem={({ item }) => item}
                        keyExtractor={(item, key) => key.toString()} />
                </View>
            </View>
        );
    }
}

export default SummaryListPage;