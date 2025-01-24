import {Image, TouchableOpacity, View} from "react-native";
import {useCaptainStore} from "@/store/captainStore";
import {acceptRideOffer} from "@/services/rideService";
import {useRouter} from "expo-router";
import Animated, {FadeInLeft, FadeOutRight} from "react-native-reanimated";
import {orderStyles} from "@/styles/captainStyles";
import {commonStyles} from "@/styles/commonStyles";
import {calculateDistance, vehicleIcons} from "@/utils/mapUtils";
import CustomText from "@/components/shared/CustomText";
import {Ionicons} from "@expo/vector-icons";
import CounterButton from "@/components/captain/counter-button";
import {memo} from "react";

type VehicleType = 'bike' | 'auto' | 'cabEconomy' | 'cabPremium';

interface RideItem {
    _id: string;
    vehicle?: VehicleType;
    pickup: { latitude: number, longitude: number; address: string };
    drop: { latitude: number, longitude: number; address: string };
    fare?: number;
    distance: number;
}

function CaptainRidesItem({removeIt, item}: { removeIt: () => void; item: RideItem }) {
    const {location} = useCaptainStore();
    const router = useRouter();

    const acceptRide = async () => {
        await acceptRideOffer(item?._id, router);
    }

    return (
        <Animated.View entering={FadeInLeft.duration(500)} exiting={FadeOutRight.duration(500)} style={orderStyles.container}>
            <View style={commonStyles.flexRowBetween}>
                <View style={commonStyles.flexRow}>
                    {item.vehicle && (
                        <Image source={vehicleIcons![item.vehicle]?.icon} style={orderStyles.rideIcon}/>
                    )}
                    <CustomText style={{textTransform: 'capitalize'}} fontSize={11}>{item.vehicle}</CustomText>
                </View>

                <CustomText fontSize={11} fontFamily={'SemiBold'}>#RID{item?._id?.slice(0, 5).toUpperCase()}</CustomText>
            </View>

            <View style={orderStyles?.locationsContainer}>
                <View style={orderStyles.flexRowBase}>
                    <View>
                        <View style={orderStyles.pickupHollowCircle}/>
                        <View style={orderStyles.continuousLine}/>
                    </View>

                    <View style={orderStyles?.infoText}>
                        <CustomText fontSize={11} numberOfLines={1} fontFamily={'SemiBold'}>{item?.pickup?.address?.slice(0, 10)}</CustomText>
                        <CustomText fontSize={9.5} numberOfLines={2} fontFamily={'Medium'} style={orderStyles.label}>{item?.pickup?.address}</CustomText>
                    </View>
                </View>

                <View style={orderStyles.flexRowBase}>
                    <View style={orderStyles.dropHollowCircle}/>

                    <View style={orderStyles?.infoText}>
                        <CustomText fontSize={11} numberOfLines={1} fontFamily={'SemiBold'}>{item?.drop?.address?.slice(0, 10)}</CustomText>
                        <CustomText fontSize={9.5} numberOfLines={2} fontFamily={'Medium'} style={orderStyles.label}>{item?.drop?.address}</CustomText>
                    </View>
                </View>
            </View>

            <View style={[commonStyles?.flexRowGap]}>
                <View>
                    <CustomText fontSize={9} fontFamily={'Medium'} style={orderStyles.label}>Pickup</CustomText>
                    <CustomText fontSize={11} fontFamily={'SemiBold'}>
                        {location && calculateDistance(item?.pickup.latitude, item?.pickup.longitude, location?.latitude, location?.longitude).toFixed(2) || '--'} Km
                    </CustomText>
                </View>

                <View>
                    <CustomText fontSize={9} fontFamily={'Medium'} style={orderStyles.label}>Drop</CustomText>
                    <CustomText fontSize={11} fontFamily={'SemiBold'}>{item?.distance.toFixed(2)} Km</CustomText>
                </View>
            </View>

            <View style={orderStyles?.flexRowEnd}>
                <TouchableOpacity>
                    <Ionicons name={'close-circle'} size={24} color={'black'}/>
                </TouchableOpacity>

                <CounterButton title={'Accept'} initialCount={2} onPress={acceptRide} onCountDownEnd={removeIt}/>
            </View>
        </Animated.View>
    );
}

export default memo(CaptainRidesItem);
