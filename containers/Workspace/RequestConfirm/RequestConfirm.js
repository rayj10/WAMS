import React from 'react';
import { Button, Header } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    View, Alert, Text,
    ScrollView, ActivityIndicator
} from 'react-native';

import styles from "./styles";
import * as workspaceAction from '../../../actions/workspaceActions';
import IconWrapper from '../../../components/IconWrapper';
import PickerWrapper from '../../../components/PickerWrapper';
import CheckBoxWrapper from '../../../components/CheckBoxWrapper';
import { color, normalize } from '../../../theme/baseTheme';
import { img } from '../../../assets/images';

//Maps reducer's states to RequestConfirm's props
export const mapStateToProps = state => ({
    token: state.authReducer.token,
    detailsReceived: state.workspaceReducer.detailsReceived,
    details: state.workspaceReducer.details
});

//Maps actions to RequestConfirm's props
export const mapDispatchToProps = (dispatch) => ({
    actionsWorkspace: bindActionCreators(workspaceAction, dispatch),
});

class RequestConfirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DONo: null,
            pickedDO: null,
            fetchStatus: null,
            verifications: []
        };

        this.onSave = this.onSave.bind(this);
        this.onFetchFinish = this.onFetchFinish.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this.props.actionsWorkspace.getRequestDOnumber(this.props.header[this.props.keys['id']], this.props.token, this.onFetchFinish);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    /**
     * Callback to be called when fetching process done
     * @param {String} status: Fetch status response (directly related to HTTP status code response)
     */
    onFetchFinish(status, data) {
        if (status === 401)
            Actions.reset('Main')   //go back to workspace and workspace will logout
        else if (status === 'DONo') {
            data.unshift(' - - - ');
            this.setState({ DONo: data });
        }
        else if (this.mounted && status === "success")
            this.setState({ fetchStatus: status });
        else {                      //in case data was stale and need refreshing to sync with current DB
            Alert.alert(status);
            this.props.refresh();
            setTimeout(() => Actions.pop(), 300);
        }
    }

    /**
     * Callback executed when user picks a DO number out of the picker
     * @param {String} DONo: Picked DO number that user wants to view the detail of 
     */
    onDOPicked(DONo) {
        this.setState({ pickedDO: DONo })
        if (DONo !== ' - - - ')
            this.props.actionsWorkspace.getRequestDODetails(DONo, this.props.token, this.onFetchFinish);
    }

    /**
     * Callback executed when user check an item off the list
     * @param {String} itemCode: Code of the checked(verified) item 
     * @param {String} itemPieceNo: piece number of the checked(verified) item  
     */
    onCheck(itemCode, itemPieceNo) {
        let temp = this.state.verifications;

        //if it's there take it off the list, if not put it in
        let index = temp.findIndex((item) => item['itemPieceNo'] === itemPieceNo)
        if (index > -1)
            temp.splice(index, 1);
        else
            temp.push({ itemPieceNo, itemCode });

        this.setState({ verifications: temp });
    }

    /**
     * Save the checked items states and update database
     */
    onSave() {
        let itemPieceNo = '', itemCode = '';

        //turn into individual strings
        this.state.verifications.forEach((element) => {
            itemPieceNo += element['itemPieceNo'] + ",";
            itemCode += element['itemCode'] + ",";
        });

        //remove last comma
        itemPieceNo = itemPieceNo.substr(0, itemPieceNo.length - 1);
        itemCode = itemCode.substr(0, itemCode.length - 1);

        Alert.alert('Save Confirmed Items?', "Once saved, you won't be able to unverify the verified items in this form", [
            { text: 'Cancel', onPress: () => console.log('Save Confirmation Cancelled'), style: 'cancel' },
            {
                text: 'Confirm', onPress: () =>
                    this.props.actionsWorkspace.confirmRequestDO(this.props.token,
                        this.props.header[this.props.keys['id']], this.state.pickedDO,
                        itemPieceNo, itemCode,
                        (title, msg) =>
                            Alert.alert(title, msg, [
                                {
                                    text: 'OK', onPress: () => {
                                        this.props.refresh();
                                        setTimeout(() => Actions.pop(), 300);
                                    }
                                }
                            ])
                    )
            }
        ]);
    }

    /**
     * Render complete request form with the help of renderItems to render individual panels for items
     */
    renderRequest() {
        let { header, keys } = this.props;
        let content = (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator animating={true} size='large' />
            </View>);

        if (this.state.DONo)
            content = (
                <ScrollView>
                    <View style={styles.requestHead}>
                        <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center', marginHorizontal: normalize(2), marginTop: normalize(2), borderRadius: 6, backgroundColor: img.formStatus[header[keys['status']]].color }}>
                            <Text style={[styles.textStyle, { marginLeft: 0, fontSize: normalize(18), color: color.white }]}>
                                {header[keys['status']]}
                            </Text>
                        </View>
                        <View style={styles.horizontalSubRequestHead}>
                            <View style={styles.verticalSubRequestHead}>
                                <Text style={styles.titleTextStyle}>{"Request No.:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['no']]}</Text>
                                <Text style={styles.titleTextStyle}>{"Request Date:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['date']]}</Text>
                            </View>
                            <View style={styles.verticalSubRequestHead}>
                                <Text style={styles.titleTextStyle}>{"Requestor:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['requestor']]}</Text>
                                <Text style={styles.titleTextStyle}>{"Department:"}</Text>
                                <Text style={styles.textStyle}>{header[keys['department']]}</Text>
                            </View>
                        </View>
                        <View style={[styles.horizontalSubRequestHead, { flex: 0.3, justifyContent: 'center' }]}>
                            <Text style={[styles.titleTextStyle, { textAlign: 'right', paddingRight: 5 }]}>{"DO Number: "}</Text>
                            <PickerWrapper items={this.state.DONo} style={{ flex: 1.3, marginTop: normalize(3) }} onSelect={(pickedDO) => this.onDOPicked(pickedDO)} />
                        </View>
                    </View>

                    <View style={styles.requestBody}>
                        {this.renderItems()}
                    </View>
                </ScrollView>);
        return content;
    }

    /**
     * Render out the items by iterating through the list of items
     * @param {Array} requestItems List of items requested
     */
    renderItems(requestItems) {
        let content = (
            <View style={{ flex: 1, alignItems: 'center', height: normalize(50) }}>
                <Text style={[styles.textStyle, { marginTop: normalize(15), textAlign: 'center', fontSize: normalize(16) }]}> No DO number selected </Text>
            </View>);

        if (this.state.pickedDO !== null && this.state.pickedDO !== ' - - - ') {
            content = (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator animating={true} size='large' />
                </View>);

            if (this.props.detailsReceived && this.props.details) {
                let { keys, details } = this.props;

                content = details.map((item, key) => {
                    return (
                        <View style={styles.itemPanel} key={key}>
                            <View style={styles.verticalSubPanel}>
                                <Text style={[styles.textStyle, { marginLeft: 1 }]}>{(key + 1) + ". " + item[keys['item']]}</Text>
                            </View>
                            <View style={styles.verticalSubPanel}>
                                <View style={styles.horizontalSubPanel}>
                                    <Text style={styles.titleTextStyle}>{"Item Code:"}</Text>
                                    <Text style={styles.textStyle}>{item[keys['code']]}</Text>
                                </View>
                                <View style={styles.horizontalSubPanel}>
                                    <Text style={styles.titleTextStyle}>{"Item Piece No.:"}</Text>
                                    <Text style={styles.textStyle}>{item[keys['piece']]}</Text>
                                </View>
                            </View>
                            <View style={styles.verticalSubPanel}>
                                <View style={styles.horizontalSubPanel}>
                                    <Text style={styles.titleTextStyle}>{"Serial No.:"}</Text>
                                    <Text style={styles.textStyle}>{item[keys['serial']]}</Text>
                                </View>
                                <View style={styles.horizontalSubPanel}>
                                    <Text style={styles.titleTextStyle}>{"Amount:"}</Text>
                                    <Text style={styles.textStyle}>{item[keys['amount']] + ' ' + item[keys['unit']]}</Text>
                                </View>
                            </View>
                            <View style={styles.verticalSubPanel}>
                                <View style={styles.horizontalSubPanel}>
                                    <Text style={styles.titleTextStyle}>{"Mac Address:"}</Text>
                                    <Text style={styles.textStyle}>{item[keys['mac']]}</Text>
                                </View>
                            </View>
                            <View style={[styles.verticalSubPanel, { flex: 0.6, justifyContent: 'center', alignItems: 'flex-start' }]}>
                                <CheckBoxWrapper title='Verified' onCheck={() => this.onCheck(item[keys['code']], item[keys['piece']])} />
                            </View>
                        </View>)
                });
            }
        }

        return content;
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    leftComponent={<IconWrapper name='chevron-left' type='font-awesome' color='white' size={28} style={styles.icon} onPress={() => Actions.pop()} />}
                    centerComponent={{ text: 'Request Confirmation', style: styles.headerText }}
                    rightComponent={<View style={{ width: 38 }} />}
                    outerContainerStyles={styles.headerOuterContainer} />
                <View style={styles.bodyContainer}>
                    {this.renderRequest()}
                </View>
                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <Button
                            raised
                            borderRadius={8}
                            title={'SAVE'}
                            backgroundColor={color.blue}
                            textStyle={styles.buttonText}
                            onPress={this.onSave} />
                    </View>
                </View>
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestConfirm);