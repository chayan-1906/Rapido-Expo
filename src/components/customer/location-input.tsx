import {StyleSheet, TextInput, TextInputProps, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {RFValue} from "react-native-responsive-fontsize";

interface LocationInputProps extends TextInputProps {
    placeholder: string,
    type: 'pickup' | 'drop',
    value: string,
    onChangeText: (text: string) => void,
}

function LocationInput({placeholder, type, value, onChangeText, ...props}: LocationInputProps) {
    const dotColor = type === 'pickup' ? 'green' : 'red';

    return (
        <View style={[styles.container, styles.focusedContainer, {backgroundColor: value === '' ? '#FFF' : '#F2F2F2'}]}>
            <View style={[styles.dot, {backgroundColor: dotColor}]}/>
            <TextInput style={[styles.input, {backgroundColor: value === '' ? '#FFF' : '#F2F2F2'}]} placeholder={placeholder} placeholderTextColor={'#AAA'} value={value}
                       onChangeText={onChangeText} {...props}/>
            {value !== '' && (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <Ionicons name={'close-circle'} size={RFValue(16)} color={'#CCC'}/>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 8,
        marginVertical: 7,
    },
    focusedContainer: {
        borderColor: '#CCC',
        borderWidth: 1,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 4,
        marginRight: 10,
    },
    input: {
        height: 45,
        width: '90%',
        fontSize: 16,
        color: '#000',
    },
});

export default LocationInput;
