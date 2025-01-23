import {Image, TouchableOpacity, View} from "react-native";
import {useWS} from "@/services/WSProvider";
import {rideStyles} from "@/styles/rideStyles";
import {commonStyles} from "@/styles/commonStyles";
import {vehicleIcons} from "@/utils/mapUtils";
import CustomText from "@/components/shared/CustomText";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {WebSocketKeys} from "@/utils/Constants";
import {Routes} from "@/utils/Routes";
import {useRouter} from "expo-router";

type VehicleType = 'bike' | 'auto' | 'cabEconomy' | 'cabPremium';

interface RideItem {
    vehicle?: VehicleType;
    _id: string;
    pickup?: { address: string };
    drop?: { address: string };
    fare?: number;
    otp?: string;
    captain: any;
    status: string;
}

function LiveTrackingSheet({item}: { item: RideItem }) {
    const {emit} = useWS();
    const router = useRouter();

    return (
        <View>
            <View style={rideStyles.headerContainer}>
                <View style={commonStyles.flexRowGap}>
                    {item.vehicle && (
                        <Image source={vehicleIcons[item.vehicle]?.icon} style={rideStyles.rideIcon}/>
                    )}

                    <CustomText fontSize={10}>
                        {item?.status === 'START' ? 'Captain near you' : item?.status === 'ARRIVED' ? 'Happy Journey' : "You had a wonderful journey"}
                    </CustomText>
                    <CustomText fontSize={10}>{item?.status === 'START' ? `OTP - ${item?.otp}` : '🕶️'}</CustomText>
                </View>
                <CustomText fontSize={11} numberOfLines={1} fontFamily={'Medium'}>
                    +91 {item?.captain?.phone && item?.captain?.phone?.slice(0, 5) + ' ' + item?.captain?.phone?.slice((5))}
                </CustomText>
            </View>
            <View style={{padding: 10}}>
                <CustomText>Location Details</CustomText>

                {/** pickup */}
                <View style={[commonStyles?.flexRowGap, {marginVertical: 15, width: '90%'}]}>
                    <Image source={require('@/assets/icons/marker.png')} style={rideStyles?.pinIcon}/>
                    <CustomText fontSize={10} numberOfLines={2}>{item?.pickup?.address}</CustomText>
                </View>

                {/** drop */}
                <View style={[commonStyles?.flexRowGap, {marginVertical: 15, width: '90%'}]}>
                    <Image source={require('@/assets/icons/drop_marker.png')} style={rideStyles?.pinIcon}/>
                    <CustomText fontSize={10} numberOfLines={2}>{item?.drop?.address}</CustomText>
                </View>

                <View style={{marginVertical: 20}}>
                    <View style={[commonStyles.flexRowBetween]}>
                        <View style={[commonStyles.flexRow]}>
                            <MaterialCommunityIcons name={'credit-card'} size={24} color={'black'}/>
                            <CustomText style={{marginLeft: 10}} fontFamily={'SemiBold'}>Payment</CustomText>
                        </View>

                        <CustomText fontFamily={'SemiBold'} fontSize={14}>₹ {item?.fare?.toFixed(2)}</CustomText>
                    </View>

                    <CustomText fontSize={10}>Payment via cash</CustomText>
                </View>
            </View>

            <View style={rideStyles.bottomButtonContainer}>
                <TouchableOpacity style={rideStyles.cancelButton} onPress={() => emit(WebSocketKeys.cancelRide, item?._id)}>
                    <CustomText style={rideStyles?.cancelButtonText}>Cancel</CustomText>
                </TouchableOpacity>

                <TouchableOpacity style={rideStyles.backButton2} onPress={() => router.replace(`/${Routes.CUSTOMER_HOME}`)}>
                    <CustomText style={rideStyles?.backButtonText}>Back</CustomText>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default LiveTrackingSheet;
