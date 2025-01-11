import {ActivityIndicator, StyleSheet, TouchableOpacity} from "react-native";
import {CustomButtonProps} from "@/utils/types";
import {Colors} from "@/utils/Constants";
import CustomText from "@/components/shared/CustomText";

function CustomButton({title, loading, onPress, disabled}: CustomButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, {backgroundColor: disabled ? Colors.secondary : Colors.primary}]}>
            {loading ? (
                <ActivityIndicator size='small' color={Colors.text}/>
            ) : (
                <CustomText fontFamily={'SemiBold'} variant={'h4'} style={{color: disabled ? Colors.white : Colors.text}}>
                    {title}
                </CustomText>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        margin: 10,
        padding: 10,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
});

export default CustomButton;
