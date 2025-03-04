import {ActivityIndicator, Alert, Platform, View} from "react-native";
import {useRoute} from "@react-navigation/core";
import {screenHeight, WebSocketKeys} from "@/utils/Constants";
import {useWS} from "@/services/WSProvider";
import {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {rideStyles} from "@/styles/rideStyles";
import {StatusBar} from "expo-status-bar";
import {resetAndNavigate} from "@/utils/Helpers";
import {Routes} from "@/utils/Routes";
import LiveTrackingMap from "@/components/customer/live-tracking-map";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import SearchingRideSheet from "@/components/customer/searching-ride-sheet";
import LiveTrackingSheet from "@/components/customer/live-tracking-sheet";

const androidHeights = [screenHeight * 0.42, screenHeight * 0.7];
const iOSHeights = [screenHeight * 0.5, screenHeight * 0.7];

function CustomerLiveRide() {
    const {emit, on, off} = useWS();
    const [rideData, setRideData] = useState<any>(null);
    const [captainCoords, setCaptainCoords] = useState<any>(null);
    const route = useRoute() as any;
    const params = route?.params || {};
    const {id: rideId} = params;

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => Platform.OS === 'ios' ? iOSHeights : androidHeights, []);
    const [mapHeight, setMapHeight] = useState(snapPoints[1]);

    const handleSheetChanges = useCallback((index: number) => {
        /*let height = screenHeight * 0.7;
        if (index === 1) {
            height = snapPoints[1];
        }
        setMapHeight(height);*/
    }, []);

    useEffect(() => {
        console.log('rideId:', rideId);
        if (rideId) {
            emit(WebSocketKeys.subscribeRide, rideId);

            on(WebSocketKeys.rideData, (data) => {
                console.log('WebSocketKeys.rideData:', data);
                setRideData(data);
                if (data?.status === 'SEARCHING_FOR_CAPTAIN') {
                    emit(WebSocketKeys.searchCaptain, rideId);
                }
            });

            on(WebSocketKeys.rideUpdate, (data) => {
                console.log('WebSocketKeys.rideUpdate');
                setRideData(data);
            });

            on(WebSocketKeys.rideCancelled, (error) => {
                resetAndNavigate(Routes.CUSTOMER_HOME);
                Alert.alert('Ride cancelled');
            });

            on(WebSocketKeys.error, (error) => {
                resetAndNavigate(Routes.CUSTOMER_HOME);
                Alert.alert('Oh! Dang! No Riders found');
            });
        }

        return () => {
            off(WebSocketKeys.rideData);
            off(WebSocketKeys.rideUpdate);
            off(WebSocketKeys.rideCancelled);
            off(WebSocketKeys.error);
        }
    }, [rideId, emit, on, off]);

    useEffect(() => {
        if (rideData?.captain?._id) {
            emit(WebSocketKeys.subscribeToCaptainLocation, rideData?.captain?._id);
            on(WebSocketKeys.captainLocationUpdate, (data) => {
                setCaptainCoords(data?.coords);
            });
        }

        return () => {
            off(WebSocketKeys.captainLocationUpdate);
        }
    }, [rideData]);

    return (
        <View style={rideStyles.container}>
            <StatusBar style={'light'} backgroundColor={'orange'} translucent={false}/>
            {rideData && (
                <LiveTrackingMap height={mapHeight} status={rideData?.status}
                                 drop={{latitude: parseFloat(rideData?.drop?.latitude), longitude: parseFloat(rideData?.drop?.longitude)}}
                                 pickup={{latitude: parseFloat(rideData?.pickup?.latitude), longitude: parseFloat(rideData?.pickup?.longitude)}}
                                 captain={
                                     captainCoords ? {
                                         latitude: captainCoords.latitude,
                                         longitude: captainCoords.longitude,
                                         heading: captainCoords.heading,
                                     } : {}
                                 }
                />
            )}

            {rideData ? (
                <BottomSheet ref={bottomSheetRef} index={1} handleIndicatorStyle={{backgroundColor: '#CCC'}} enableOverDrag={true} enableDynamicSizing={false} style={{zIndex: 4}}
                             snapPoints={snapPoints} onChange={handleSheetChanges}>
                    <BottomSheetScrollView contentContainerStyle={rideStyles?.container}>
                        {rideData?.status === 'SEARCHING_FOR_CAPTAIN' ? (
                            <SearchingRideSheet item={rideData}/>
                        ) : (
                            <LiveTrackingSheet item={rideData}/>
                        )}
                    </BottomSheetScrollView>
                </BottomSheet>
            ) : (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator color={'black'} size={'small'}/>
                </View>
            )}
        </View>
    );
}

export default memo(CustomerLiveRide);
