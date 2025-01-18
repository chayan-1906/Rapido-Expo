import {Image, Text, TouchableOpacity, View} from "react-native";
import {rideStyles} from "@/styles/rideStyles";
import {commonStyles} from "@/styles/commonStyles";
import CustomText from "@/components/shared/CustomText";

function RideOption({ride, selected, onSelect}: any) {
    const {type, icon, isFastest, seats, time, dropTime, price} = ride;

    return (
        <TouchableOpacity style={[rideStyles.rideOption, {borderColor: selected === type ? '#222' : '#DDD'}]} onPress={() => onSelect(type)}>
            <View style={commonStyles.flexRowBetween}>
                <Image source={icon} alt={type} style={rideStyles.rideIcon}/>
                <View style={rideStyles.rideDetails}>
                    <CustomText fontFamily={'Medium'}>
                        {type} {isFastest && (
                        <Text style={rideStyles.fastestLabel}>FASTEST</Text>
                    )}
                    </CustomText>
                    <CustomText fontSize={10}>{seats} seats • {time} away • Drop {dropTime}</CustomText>
                </View>
                <View style={rideStyles.priceContainer}>
                    <CustomText fontFamily={'Medium'} fontSize={14}>₹{price.toFixed(2)}</CustomText>
                    {selected === type && (
                        <Text style={rideStyles.discountedPrice}>₹{Number(price + 10).toFixed(2)}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default RideOption;
