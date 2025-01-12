import {StyleSheet, TextInput, View} from "react-native";
import {PhoneInputProps} from "@/utils/types";
import {RFValue} from "react-native-responsive-fontsize";
import CustomText from "@/components/shared/CustomText";

function PhoneInput({value, onChangeText, onBlur, onFocus}: PhoneInputProps) {
    return (
        <View style={styles.container}>
            <CustomText fontFamily={'Medium'} style={styles.text}>🇮🇳 +91</CustomText>
            <TextInput placeholder={'0000000000'} placeholderTextColor={'#CCC'} maxLength={10} keyboardType={'phone-pad'} value={value}
                       onChangeText={onChangeText} onFocus={onFocus} onBlur={onBlur} style={styles.input}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginVertical: 15,
        borderEndWidth: 1,
        borderWidth: 1,
        borderColor: '#222',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    input: {
        fontSize: RFValue(13),
        fontFamily: 'Medium',
        height: 45,
        width: '90%',
    },
    text: {
        fontSize: RFValue(13),
        top: -1,
        fontFamily: 'Medium',
    },
});

export default PhoneInput;
