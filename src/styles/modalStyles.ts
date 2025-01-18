import {Colors} from '@/utils/Constants';
import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

export const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    footerContainer: {
        backgroundColor: '#fff',
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: '#000',
        elevation: 10,
        padding: 15,
    },
    addressText: {
        fontSize: RFValue(12),
    },
    button: {
        backgroundColor: Colors.iOSColor,
        borderRadius: 6,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        marginVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: RFValue(13),
        fontWeight: '700',
    },
    centerText: {
        textAlign: 'center',
        fontWeight: '600',
        marginTop: 16,
        fontSize: RFValue(16),
        textTransform: 'capitalize',
    },
    cancelButton: {
        color: Colors.iOSColor,
        fontSize: RFValue(16),
        position: 'absolute',
        top: -18,
        zIndex: 99,
        right: 14,
    },
    searchContainer: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        margin: 15,
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    input: {
        backgroundColor: '#f2f2f2',
        width: '92%',
        height: 42,
    },
});
