import {Alert, View} from "react-native";
import {rideStyles} from "@/styles/rideStyles";
import {StatusBar} from "expo-status-bar";
import {useEffect, useState} from "react";
import * as Location from "expo-location";
import {LocationAccuracy} from "expo-location";
import {WebSocketKeys} from "@/utils/Constants";
import {useCaptainStore} from "@/store/captainStore";
import {useWS} from "@/services/WSProvider";
import {useRoute} from "@react-navigation/core";
import {resetAndNavigate} from "@/utils/Helpers";
import {Routes} from "@/utils/Routes";
import CaptainLiveTracking from "@/components/captain/captain-live-tracking";
import {updateRideStatus} from "@/services/rideService";
import CaptainActionButton from "@/components/captain/captain-action-button";
import OtpInputModal from "@/components/captain/otp-input-modal";

function CaptainLiveRide() {
    const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
    const {location, setLocation, setOnDuty} = useCaptainStore();
    const {emit, on, off} = useWS();
    const [rideData, setRideData] = useState<any>(null);
    const route = useRoute() as any;
    const params = route?.params || {};
    const id = params.id;

    useEffect(() => {
        let locationSubscription: any;

        const startLocationUpdates = async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                locationSubscription = await Location.watchPositionAsync({
                    accuracy: LocationAccuracy.High,
                    timeInterval: 5000,
                    distanceInterval: 2,
                }, (location) => {
                    const {latitude, longitude, heading} = location.coords;
                    setLocation({latitude, longitude, address: 'Somewhere', heading: heading as number});
                    setOnDuty(true);
                    emit(WebSocketKeys.goOnDuty, {latitude: location.coords.latitude, longitude: location.coords.longitude, heading: heading as number});
                    emit(WebSocketKeys.updateLocation, {latitude, longitude, heading});
                    console.log(`Location updated: lat: ${latitude}, long: ${longitude}, heading: ${heading}`);
                });
            } else {
                console.log('Location permission denied');
            }
        }

        startLocationUpdates();

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            emit(WebSocketKeys.subscribeRide, id);
            on(WebSocketKeys.rideData, (data) => {
                setRideData(data);
            });
            on(WebSocketKeys.rideCancelled, (error) => {
                console.log('Ride error:', error);
                resetAndNavigate(Routes.CAPTAIN_HOME);
                Alert.alert('Ride canceled');
            });

            on(WebSocketKeys.rideUpdate, (data) => {
                setRideData(data);
            });
            on(WebSocketKeys.error, (error) => {
                console.log('Ride error:', error);
                resetAndNavigate(Routes.CAPTAIN_HOME);
                Alert.alert('Oh Dang! There was an error');
            });
        }

        return () => {
            off(WebSocketKeys.rideData);
            off(WebSocketKeys.error);
        };
    }, [id, emit, on, off]);

    return (
        <View style={rideStyles.container}>
            <StatusBar style={'light'} backgroundColor={'orange'} translucent={false}/>
            {rideData && (
                <CaptainLiveTracking
                    status={rideData?.status}
                    drop={{latitude: parseFloat(rideData?.drop?.latitude), longitude: parseFloat(rideData?.drop?.longitude)}}
                    pickup={{latitude: parseFloat(rideData?.pickup?.latitude), longitude: parseFloat(rideData?.pickup?.longitude)}}
                    captain={{latitude: location?.latitude, longitude: location?.longitude, heading: location?.heading}}
                />
            )}
            <CaptainActionButton
                ride={rideData} title={rideData?.status === 'START' ? 'ARRIVED' : rideData?.status === 'ARRIVED' ? 'COMPLETED' : 'SUCCESS'}
                onPress={async () => {
                    if (rideData?.status === 'START') {
                        setIsOTPModalVisible(true);
                        return;
                    }
                    const isSuccess = await updateRideStatus(rideData?._id, 'COMPLETED');
                    if (isSuccess) {
                        Alert.alert('Congratulations! you rock 🎉');
                        resetAndNavigate(Routes.CAPTAIN_HOME);
                    } else {
                        Alert.alert('There was an error');
                    }
                }}
                color={'#228B22'}
            />

            {isOTPModalVisible && (
                <OtpInputModal
                    title={'Enter OTP below'} visible={isOTPModalVisible}
                    onClose={() => setIsOTPModalVisible(false)}
                    onConfirm={async (otp) => {
                        if (otp === rideData?.otp) {
                            const isSuccess = await updateRideStatus(rideData?._id, 'ARRIVED');
                            if (isSuccess) {
                                setIsOTPModalVisible(false);
                            } else {
                                Alert.alert('Technical Error');
                            }
                        } else {
                            Alert.alert('Invalid OTP');
                        }
                    }}
                />
            )}
        </View>
    );
}

export default CaptainLiveRide;
