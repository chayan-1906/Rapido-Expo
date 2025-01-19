import {Alert, Image, ScrollView, TouchableOpacity, View} from "react-native";
import {useRoute} from "@react-navigation/core";
import {useCustomerStore} from "@/store/customerStore";
import {memo, useCallback, useEffect, useMemo, useState} from "react";
import {calculateFare} from "@/utils/mapUtils";
import {rideStyles} from "@/styles/rideStyles";
import {StatusBar} from "expo-status-bar";
import CustomText from "@/components/shared/CustomText";
import RideOption from "@/components/customer/ride-option";
import {useRouter} from "expo-router";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {RFValue} from "react-native-responsive-fontsize";
import {commonStyles} from "@/styles/commonStyles";
import CustomButton from "@/components/shared/CustomButton";
import RoutesMap from "@/components/customer/routes-map";
import {createRide} from "@/services/rideService";

function CustomerRideBooking() {
    const router = useRouter();
    const route = useRoute() as any;
    const item = route?.params as any;
    const {location: pickup} = useCustomerStore() as any;
    const [selectedOption, setSelectedOption] = useState('Bike');
    const [loading, setLoading] = useState(false);

    const farePrices = useMemo(() => calculateFare(parseFloat(item?.distanceInKm)), [item?.distanceInKm]);

    const rideOptions = useMemo(() => [
        {type: 'Bike', seats: 1, time: '1 min', dropTime: '4:28 pm', price: farePrices?.bike, isFastest: true, icon: require('@/assets/icons/bike.png')},
        {type: 'Auto', seats: 3, time: '1 min', dropTime: '4:30 pm', price: farePrices?.auto, icon: require('@/assets/icons/auto.png')},
        {type: 'Cab Economy', seats: 4, time: '1 min', dropTime: '4:28 pm', price: farePrices?.cabEconomy, icon: require('@/assets/icons/cab.png')},
        {type: 'Cab Premium', seats: 4, time: '1 min', dropTime: '4:30 pm', price: farePrices?.cabPremium, icon: require('@/assets/icons/cab_premium.png')},
    ], []);

    const handleOptionSelect = useCallback((type: string) => {
        setSelectedOption(type);
    }, []);

    const handleRideBooking = useCallback(async () => {
        setLoading(true);
        let selectedRide: 'bike' | 'auto' | 'cabEconomy' | 'cabPremium';
        if (selectedOption === 'Auto') {
            selectedRide = 'auto';
        } else if (selectedOption === 'Cab Economy') {
            selectedRide = 'cabEconomy';
        } else if (selectedOption === 'Cab Premium') {
            selectedRide = 'cabPremium';

        } else {
            selectedRide = 'bike';
        }

        if (!pickup.latitude || !pickup.longitude) {
            Alert.alert('Invalid pickup location');
            setLoading(false);
            return;
        }
        if (!item.drop_latitude || !item.drop_longitude) {
            Alert.alert('Invalid drop location');
            setLoading(false);
            return;
        }
        await createRide({
            vehicle: selectedRide,
            pickup: {
                latitude: parseFloat(pickup.latitude),
                longitude: parseFloat(pickup.longitude),
                address: pickup.address,
            },
            drop: {
                latitude: parseFloat(item.drop_latitude),
                longitude: parseFloat(item.drop_longitude),
                address: item.drop_address,
            },
        }, router);
        setLoading(false);
    }, [pickup, item]);

    useEffect(() => {
        // for debugging
        console.log('pickup:', pickup);
        console.log('drop:', item);
    }, [pickup, item]);

    return (
        <View style={rideStyles.container}>
            <StatusBar style={'light'} backgroundColor={'orange'} translucent={true}/>

            {item?.drop_latitude && pickup?.latitude && (
                <RoutesMap
                    drop={{latitude: parseFloat(item?.drop_latitude), longitude: parseFloat(item?.drop_longitude)}}
                    pickup={{latitude: parseFloat(pickup?.latitude), longitude: parseFloat(pickup?.longitude)}}
                />
            )}

            <View style={rideStyles.rideSelectionContainer}>
                <View style={rideStyles.offerContainer}>
                    <CustomText fontSize={12} style={rideStyles.offerText}>You get ₹10 off 5 coins cashback!</CustomText>
                </View>

                {/** ride options */}
                <ScrollView contentContainerStyle={rideStyles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {rideOptions.map((option, index) => (
                        <RideOption key={index} ride={option} selected={selectedOption} onSelect={handleOptionSelect}/>
                    ))}
                </ScrollView>
            </View>

            {/** back */}
            <TouchableOpacity style={rideStyles.backButton} onPress={router.back}>
                <MaterialIcons name={'arrow-back-ios'} size={RFValue(14)} style={{left: 4}} color={'black'}/>
            </TouchableOpacity>

            <View style={rideStyles.bookingContainer}>
                <View style={commonStyles.flexRowBetween}>
                    <View style={[rideStyles.couponContainer, {borderRightWidth: 1, borderRightColor: '#CCC'}]}>
                        <Image source={require('@/assets/icons/rupee.png')} style={rideStyles.icon}/>
                        <View>
                            <CustomText fontFamily={'Medium'} fontSize={12}>Cash</CustomText>
                            <CustomText fontFamily={'Medium'} fontSize={10} style={{opacity: 0.7}}>Far: {item?.distanceInKm} KM</CustomText>
                        </View>
                        <Ionicons name={'chevron-forward'} size={RFValue(14)} color={'#777'}/>
                    </View>

                    <View style={[rideStyles.couponContainer]}>
                        <Image source={require('@/assets/icons/coupon.png')} style={rideStyles.icon}/>
                        <View>
                            <CustomText fontFamily={'Medium'} fontSize={12}>GORAPIDO</CustomText>
                            <CustomText fontFamily={'Medium'} fontSize={10} style={{opacity: 0.7}}>Coupon Applied</CustomText>
                        </View>
                        <Ionicons name={'chevron-forward'} size={RFValue(14)} color={'#777'}/>
                    </View>
                </View>

                <CustomButton title={'Book Ride'} disabled={loading} loading={loading} onPress={handleRideBooking}/>
            </View>
        </View>
    );
}

export default memo(CustomerRideBooking);
