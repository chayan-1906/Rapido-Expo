import {FlatList, Image, View} from "react-native";
import {homeStyles} from "@/styles/homeStyles";
import {StatusBar} from "expo-status-bar";
import CaptainHeader from "@/components/captain/captain-header";
import {useWS} from "@/services/WSProvider";
import {useCaptainStore} from "@/store/captainStore";
import {useIsFocused} from "@react-navigation/core";
import {useEffect, useState} from "react";
import {captainStyles} from "@/styles/captainStyles";
import CustomText from "@/components/shared/CustomText";
import {WebSocketKeys} from "@/utils/Constants";
import * as Location from "expo-location";
import {LocationAccuracy} from "expo-location";
import CaptainRidesItem from "@/components/captain/captain-rides-item";

function CaptainHome() {
    const {disconnect, emit, on, off} = useWS();
    const {onDuty, setOnDuty, setLocation} = useCaptainStore();
    const isFocused = useIsFocused();
    const [rideOffers, setRideOffers] = useState<any[]>([]);

    const removeRide = (id: string) => {
        setRideOffers((prevOffers) => prevOffers.filter((offer) => offer._id !== id));
    }

    const renderRides = ({item}: any) => {
        return (
            <CaptainRidesItem removeIt={() => removeRide(item?._id)} item={item}/>
        );
    }

    useEffect(() => {
        let locationSubscription: any;
        const startLocationUpdates = async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                locationSubscription = await Location.watchPositionAsync({
                    accuracy: LocationAccuracy.High,
                    timeInterval: 10000,
                    distanceInterval: 10,
                }, (location) => {
                    const {latitude, longitude, heading} = location.coords;
                    setLocation({latitude, longitude, address: 'Somewhere', heading: heading as number});
                    emit(WebSocketKeys.updateLocation, {latitude, longitude, heading});
                });
            }
        }

        if (onDuty && isFocused) {
            startLocationUpdates();
        }

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        }
    }, [onDuty, isFocused]);

    useEffect(() => {
        if (onDuty && isFocused) {
            on(WebSocketKeys.rideOffer, (rideDetails: any) => {
                setRideOffers((prevOffers) => {
                    const existingIds = new Set(prevOffers?.map((offer) => offer._id));
                    if (!existingIds.has(rideDetails?._id)) {
                        return [...prevOffers, rideDetails];
                    }

                    return prevOffers;
                });
            });
        }

        return () => {
            off(WebSocketKeys.rideOffer);
        }
    }, [onDuty, on, off, isFocused]);

    // useEffect(() => {
    //     getMyRides(false);
    // }, []);

    return (
        <View style={homeStyles.container}>
            <StatusBar style={'light'} backgroundColor={'orange'} translucent={false}/>
            <CaptainHeader/>
            <FlatList data={!onDuty ? [] : rideOffers}
                      renderItem={renderRides} style={{flex: 1}}
                      contentContainerStyle={{padding: 10, paddingBottom: 20}}
                      keyExtractor={(item: any) => item?._id || Math.random().toString()}
                      ListEmptyComponent={
                          <View style={captainStyles?.emptyContainer}>
                              <Image source={require('@/assets/icons/ride.jpg')} style={captainStyles?.emptyImage}/>
                              <CustomText fontSize={12} style={{textAlign: 'center'}}>
                                  {onDuty ? 'There are no available rides! Stay Active' : 'You are currently OFF_DUTY, please go ON-DUTY to start learning'}
                              </CustomText>
                          </View>
                      }
            />
        </View>
    );
}

export default CaptainHome;
