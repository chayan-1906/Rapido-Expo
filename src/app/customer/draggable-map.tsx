import {Image, TouchableOpacity, View} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE, Region} from "react-native-maps";
import {memo, useEffect, useRef, useState} from "react";
import {customMapStyle, indiaInitialRegion} from "@/utils/CustomMap";
import {mapStyles} from "@/styles/mapStyles";
import {FontAwesome6, MaterialCommunityIcons} from "@expo/vector-icons";
import {RFValue} from "react-native-responsive-fontsize";
import {useCustomerStore} from "@/store/customerStore";
import {useIsFocused} from "@react-navigation/core";
import * as Location from 'expo-location';
import {reverseGeocode} from "@/utils/mapUtils";
import haversineDistance from "haversine-distance";
import {useWS} from "@/services/WSProvider";
import {WebSocketKeys} from "@/utils/Constants";

function DraggableMap({height}: { height: number }) {
    const mapRef = useRef<MapView>(null);
    const {location, setLocation, outOfRange, setOutOfRange} = useCustomerStore();
    const isFocused = useIsFocused();
    const [markers, setMarkers] = useState<any>([]);
    const {emit, on, off} = useWS();

    const MAX_DISTANCE_THRESHOLD = 10000;

    const handleRegionChangeComplete = async (region: Region) => {
        const address = await reverseGeocode(region?.latitude, region?.longitude);
        setLocation({latitude: region?.latitude, longitude: region?.longitude, address});
        const userLocation = {
            latitude: region?.latitude,
            longitude: region?.longitude,
        } as any;

        if (userLocation) {
            const newLocation = {latitude: region.latitude, longitude: region.longitude};
            const distance = haversineDistance(userLocation, newLocation);
            setOutOfRange(distance > MAX_DISTANCE_THRESHOLD);
        }
    }

    const handleGPSButton = async () => {
        try {
            const {status} = await Location.requestForegroundPermissionsAsync();
            const currentLocation = await Location.getCurrentPositionAsync({});
            const {latitude, longitude} = currentLocation?.coords;

            mapRef?.current?.fitToCoordinates([{latitude, longitude}], {
                edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
                animated: true,
            });

            const address = await reverseGeocode(latitude, longitude);
            setLocation({latitude, longitude, address});
        } catch (error) {
            console.log('Error getting location:', error);
        }
    }

    const askLocationAccess = async () => {
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            try {
                const location = await Location.getCurrentPositionAsync();
                const {latitude, longitude} = location.coords;
                mapRef?.current?.fitToCoordinates([{latitude, longitude}], {
                    edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
                    animated: true,
                });

                const newRegion = {
                    latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05,
                }
                await handleRegionChangeComplete(newRegion);
            } catch (error) {
                console.log('error getting current location:', error);
            }
        } else {
            console.log('Permission to access location was denied');
        }
    }

    const generateRandomMarkers = () => {
        console.log('generateRandomMarkers:', location);
        if (!location?.latitude || !location?.longitude) return;

        const types = ['bike', 'auto', 'cab'];
        const newMarkers = Array.from({length: 20}, (_, index) => {
            const randomType = types[Math.floor(Math.random() * types.length)];
            const randomRotation = Math.floor(Math.random() * 360);

            return {
                id: index,
                latitude: location?.latitude + (Math.random() - 0.5) * 0.01,
                longitude: location?.longitude + (Math.random() - 0.5) * 0.01,
                type: randomType,
                rotation: randomRotation,
                visible: true,
            };
        });
        console.log('newMarkers:', newMarkers);

        setMarkers(newMarkers);
    }

    useEffect(() => {
        if (isFocused) {
            askLocationAccess();
        }
    }, [mapRef, isFocused]);

    // REAL CAPTAIN MARKERS
    // useEffect(() => {
    //     if (location?.latitude && location?.longitude && isFocused) {
    //         emit(WebSocketKeys.subscribeToZone, {latitude: location?.latitude, longitude: location?.longitude});
    //         on(WebSocketKeys.nearbyCaptains, (captains: any[]) => {
    //             const updatedMarkers = captains.map((captain) => {
    //                 const {id, coords} = captain;
    //
    //                 return ({
    //                     id,
    //                     latitude: coords?.latitude,
    //                     longitude: coords?.longitude,
    //                     type: 'captain',
    //                     rotation: coords?.heading,
    //                     visible: true,
    //                 });
    //             });
    //             setMarkers(updatedMarkers);
    //         });
    //
    //         return () => {
    //             off(WebSocketKeys.nearbyCaptains);
    //         }
    //     }
    // }, []);

    // SIMULATION NEARBY CAPTAIN
    useEffect(() => {
        generateRandomMarkers();
    }, [location]);

    return (
        <View style={{height: height, width: '100%'}}>
            <MapView ref={mapRef} initialRegion={indiaInitialRegion}
                     minZoomLevel={9}
                     maxZoomLevel={16}
                    // cameraZoomRange={{minCenterCoordinateDistance: 12, maxCenterCoordinateDistance: 16}}
                     pitchEnabled={false} onRegionChangeComplete={handleRegionChangeComplete} style={{flex: 1}} customMapStyle={customMapStyle}
                     showsMyLocationButton={false} showsCompass={false} showsIndoors={false} showsIndoorLevelPicker={false} showsTraffic={false} showsScale={false} showsBuildings={false}
                     showsPointsOfInterest={false} showsUserLocation={true}>
                {markers.map((marker: any, index: number) => {
                    const {type, rotation, latitude, longitude, visible} = marker;
                    let image = require('@/assets/icons/cab_marker.png');
                    if (type === 'bike') {
                        image = require('@/assets/icons/bike_marker.png');
                    } else if (type === 'auto') {
                        image = require('@/assets/icons/auto_marker.png');
                    } else if (type === 'cab') {
                        image = require('@/assets/icons/cab_marker.png');
                    }

                    return (
                        visible && (
                            <Marker key={index} zIndex={index} flat anchor={{x: 0.5, y: 0.5}} coordinate={{latitude, longitude}}>
                                <View style={{transform: [{rotate: `${rotation}deg`}]}}>
                                    {/*<Image source={require(image)} style={{height: 40, width: 40}}/>*/}
                                    <Image source={image} style={{height: 40, width: 40, resizeMode: 'contain'}}/>
                                </View>
                            </Marker>
                        )
                    );
                })}
            </MapView>

            <View style={mapStyles.centerMarkerContainer}>
                <Image source={require('@/assets/icons/marker.png')} style={mapStyles.marker}/>
            </View>

            <TouchableOpacity style={mapStyles.gpsButton} onPress={handleGPSButton}>
                <MaterialCommunityIcons name={'crosshairs-gps'} size={RFValue(18)} color={'#3C75BE'}/>
            </TouchableOpacity>

            {outOfRange && (
                <View style={mapStyles.outOfRange}>
                    <FontAwesome6 name={'road-circle-exclamation'} size={24} color={'red'}/>
                </View>
            )}
        </View>
    );
}

export default memo(DraggableMap);
