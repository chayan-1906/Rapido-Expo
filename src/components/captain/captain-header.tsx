import {Alert, Image, TouchableOpacity, View} from "react-native";
import {useWS} from "@/services/WSProvider";
import {useCaptainStore} from "@/store/captainStore";
import {useIsFocused} from "@react-navigation/core";
import {captainStyles} from "@/styles/captainStyles";
import {SafeAreaView} from "react-native-safe-area-context";
import {commonStyles} from "@/styles/commonStyles";
import {MaterialIcons} from "@expo/vector-icons";
import {logout} from "@/services/authService";
import CustomText from "@/components/shared/CustomText";
import {useEffect} from "react";
import * as Location from 'expo-location';
import {WebSocketKeys} from "@/utils/Constants";

function CaptainHeader() {
    const {disconnect, emit} = useWS();
    const {onDuty, setOnDuty, setLocation} = useCaptainStore();
    const isFocused = useIsFocused();

    const toggleOnDuty = async () => {
        if (onDuty) {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location permission is required to go on duty');
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            const {latitude, longitude, heading} = location.coords;
            setLocation({latitude, longitude, address: 'Somewhere', heading: heading as number});
            emit(WebSocketKeys.goOnDuty, {latitude, longitude, heading});
        } else {
            emit(WebSocketKeys.goOffDuty);
        }
    }

    useEffect(() => {
        if (isFocused) {
            toggleOnDuty();
        }
    }, [isFocused, onDuty]);

    return (
        <View style={captainStyles.headerContainer}>
            <SafeAreaView/>
            <View style={commonStyles.flexRowBetween}>
                <MaterialIcons name={'menu'} size={24} color={'black'} onPress={() => logout(disconnect)}/>
                <TouchableOpacity style={captainStyles.toggleContainer} onPress={toggleOnDuty}>
                    <CustomText fontFamily={'SemiBold'} fontSize={12} style={{color: '#888'}}>{onDuty ? 'ON-DUTY' : 'OFF-DUTY'}</CustomText>
                    <Image source={onDuty ? require('@/assets/icons/switch_on.png') : require('@/assets/icons/switch_off.png')} style={captainStyles.icon}/>
                </TouchableOpacity>
                <MaterialIcons name={'notifications'} size={24} color={'black'}/>
            </View>
        </View>
    );
}

export default CaptainHeader;
