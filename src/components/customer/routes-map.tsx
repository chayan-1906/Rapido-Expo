import {Image, TouchableOpacity, View} from "react-native";
import {memo, useCallback, useEffect, useRef} from "react";
import MapView, {Marker} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {RFValue} from "react-native-responsive-fontsize";
import {mapStyles} from "@/styles/mapStyles";
import {customMapStyle, indiaInitialRegion} from "@/utils/CustomMap";
import {Colors} from "@/utils/Constants";

const apiKey = process.env.EXPO_PUBLIC_MAP_API_KEY || '';

function RoutesMap({drop, pickup}: { drop: any, pickup: any }) {
    const mapRef = useRef<MapView>(null);

    const fitToMarkers = useCallback(() => {
        const coordinates = [];
        const {latitude: pickupLat, longitude: pickupLng} = pickup || {};
        const {latitude: dropLat, longitude: dropLng} = drop || {};

        if (pickupLat && pickupLng) {
            coordinates.push({latitude: pickupLat, longitude: pickupLng});
        }
        if (dropLat && dropLng) {
            coordinates.push({latitude: dropLat, longitude: dropLng});
        }

        if (coordinates.length == 0) return;

        try {
            mapRef.current?.fitToCoordinates(coordinates, {
                edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
                animated: true,
            });
        } catch (error) {
            console.error('inside catch of fitToMarkers:', error);
        }
    }, []);

    const fitToMarkersWithDelay = () => setTimeout(() => fitToMarkers(), 500)

    const calculateInitialRegion = () => {
        if (pickup?.latitude && drop?.latitude) {
            const latitude = (pickup.latitude + drop.latitude) / 2;
            const longitude = (pickup.longitude + drop.longitude) / 2;
            return {
                latitude,
                longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            };
        }

        return indiaInitialRegion;
    }

    useEffect(() => {
        console.log('drop in routes-map:', drop);
        if (drop?.latitude && pickup?.latitude) {
            fitToMarkersWithDelay();
        }
    }, [drop?.latitude, pickup?.latitude, mapRef]);

    return (
        <View style={{flex: 1, backgroundColor: 'orange'}}>
            <MapView ref={mapRef} initialRegion={calculateInitialRegion()}
                // minZoomLevel={9}
                // maxZoomLevel={16}
                // cameraZoomRange={{minCenterCoordinateDistance: 12, maxCenterCoordinateDistance: 16}}
                     pitchEnabled={false} style={{flex: 1}} customMapStyle={customMapStyle}
                     showsMyLocationButton={false} showsCompass={false} showsIndoors={false} showsIndoorLevelPicker={false} showsTraffic={false} showsScale={false} showsBuildings={false}
                     showsPointsOfInterest={false} showsUserLocation={true}>

                {drop?.latitude && pickup?.latitude && (
                    <MapViewDirections
                        apikey={apiKey}
                        origin={pickup}
                        destination={drop}
                        strokeWidth={5}
                        strokeColor={Colors.primary}
                        precision={'high'}
                        onReady={fitToMarkersWithDelay}
                        onError={(err) => console.log('Directions error:', err)}
                    />
                )}

                {/** drop marker */}
                {drop?.latitude && (
                    <Marker zIndex={1} anchor={{x: 0.5, y: 1}} coordinate={{latitude: drop.latitude, longitude: drop.longitude}}>
                        <Image source={require('@/assets/icons/drop_marker.png')} style={{height: 30, width: 30, resizeMode: 'contain'}}/>
                    </Marker>
                )}

                {/** pickup marker */}
                {pickup?.latitude && (
                    <Marker zIndex={2} anchor={{x: 0.5, y: 1}} coordinate={{latitude: pickup.latitude, longitude: pickup.longitude}}>
                        <Image source={require('@/assets/icons/marker.png')} style={{height: 30, width: 30, resizeMode: 'contain'}}/>
                    </Marker>
                )}

                {/** gps button */}
                <TouchableOpacity style={mapStyles.container} onPress={fitToMarkers}>
                    <MaterialCommunityIcons name={'crosshairs-gps'} size={RFValue(16)} color={'#3C75BE'}/>
                </TouchableOpacity>
            </MapView>
        </View>
    );
}

export default memo(RoutesMap);
