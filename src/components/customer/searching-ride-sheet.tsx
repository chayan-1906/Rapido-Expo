import {ActivityIndicator, Image, TouchableOpacity, View} from "react-native";
import {useWS} from "@/services/WSProvider";
import {rideStyles} from "@/styles/rideStyles";
import {commonStyles} from "@/styles/commonStyles";
import {vehicleIcons} from "@/utils/mapUtils";
import CustomText from "@/components/shared/CustomText";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {WebSocketKeys} from "@/utils/Constants";
import {useRouter} from "expo-router";
import {Routes} from "@/utils/Routes";

type VehicleType = 'bike' | 'auto' | 'cabEconomy' | 'cabPremium';

interface RideItem {
    vehicle?: VehicleType;
    _id: string;
    pickup?: { address: string };
    drop?: { address: string };
    fare?: number;
}

function SearchingRideSheet({item}: { item: RideItem }) {
    const {emit} = useWS();
    const router = useRouter();

    return (
        <View>
            <View style={rideStyles?.headerContainer}>
                <View style={commonStyles.flexRowBetween}>
                    {item?.vehicle && (
                        <Image source={vehicleIcons[item.vehicle]?.icon} style={rideStyles.rideIcon}/>
                    )}
                    <View>
                        <CustomText fontSize={10}>Looking for your</CustomText>
                        <CustomText fontFamily={'Medium'} fontSize={12}>{item?.vehicle} ride</CustomText>
                    </View>
                </View>

                <ActivityIndicator color={'black'} size={'small'}/>
            </View>

            {/** pickup & drop */}
            <View style={{padding: 10}}>
                <CustomText fontFamily={'SemiBold'} fontSize={12}>Location Details</CustomText>

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

export default SearchingRideSheet;
