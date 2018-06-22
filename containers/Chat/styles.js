import { StyleSheet } from 'react-native';
import { padding, color, fontSize, fontFamily, windowWidth, normalize } from '../../theme/baseTheme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        marginRight: 10,
        marginLeft: 10
    },
    rightButton: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 10,
        padding: 0,
    },
    topGroup: {
        flexDirection: 'row',
        margin: 10
    },
    myFriends: {
        flex: 1,
        color: Colors.grayColor,
        fontSize: 16,
        padding: 5
    },
    inviteFriends: {
        color: Colors.mainColor,
        padding: 5
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 6,
        marginBottom: 8,
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 6
    },
    profileName: {
        marginLeft: 6,
        fontSize: 16
    }
})