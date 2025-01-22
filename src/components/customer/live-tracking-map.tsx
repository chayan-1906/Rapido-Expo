import {Image, TouchableOpacity, View} from "react-native";
import {memo, useEffect, useRef, useState} from "react";
import MapView, {Marker, Polyline, PROVIDER_DEFAULT} from "react-native-maps";
import {customMapStyle, indiaInitialRegion} from "@/utils/CustomMap";
import MapViewDirections from "react-native-maps-directions";
import {Colors} from "@/utils/Constants";
import {apiKey} from "@/components/customer/routes-map";
import {getPoints} from "@/utils/mapUtils";
import {mapStyles} from "@/styles/mapStyles";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {RFValue} from "react-native-responsive-fontsize";

function LiveTrackingMap({height, status, drop, pickup, captain}: { height: number, status: string, drop: any, pickup: any, captain: any }) {
    const mapRef = useRef<MapView>(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    const fitToMarkers = async () => {
        if (isUserInteracting) return;

        const coordinates = [];

        if (pickup?.latitude && pickup?.longitude && status == 'START') {
            coordinates.push({latitude: pickup.latitude, longitude: pickup.longitude});
        }
        if (drop?.latitude && drop?.longitude && status == 'ARRIVED') {
            coordinates.push({latitude: drop.latitude, longitude: drop.longitude});
        }
        if (captain?.latitude && captain?.longitude) {
            coordinates.push({latitude: captain.latitude, longitude: captain.longitude});
        }

        if (coordinates.length === 0) return;

        try {
            mapRef.current?.fitToCoordinates(coordinates, {
                edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
                animated: true,
            });
        } catch (error) {
            console.error('inside catch of fitToMarkers:', error);
        }
    }

    const calculateInitialRegion = () => {
        if (pickup?.latitude && pickup?.longitude) {
            const latitude = (pickup.latitude + drop.latitude) / 2;
            const longitude = (pickup.longitude + drop.longitude) / 2;

            return {latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05};
        }
        return indiaInitialRegion;
    }

    useEffect(() => {
        if (pickup?.latitude && drop.latitude) fitToMarkers();
    }, [drop?.latitude, pickup?.latitude, captain.latitude]);

    return (
        <View style={{height: height, width: '100%', backgroundColor: 'red'}}>
            <MapView ref={mapRef} followsUserLocation style={{flex: 1}} initialRegion={calculateInitialRegion()} provider={PROVIDER_DEFAULT} showsMyLocationButton showsCompass={false}
                     showsIndoors={false} showsUserLocation customMapStyle={customMapStyle} onRegionChange={() => setIsUserInteracting(true)}
                     onRegionChangeComplete={() => setIsUserInteracting(false)}>
                {captain?.latitude && pickup?.latitude && (
                    <MapViewDirections
                        apikey={apiKey}
                        origin={captain}
                        destination={status === 'START' ? pickup : drop}
                        strokeWidth={5}
                        strokeColor={Colors.primary}
                        precision={'high'}
                        onReady={fitToMarkers}
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

                {/** captain marker */}
                {captain?.latitude && (
                    <Marker zIndex={1} anchor={{x: 0.5, y: 1}} coordinate={{latitude: drop.latitude, longitude: drop.longitude}}>
                        <View style={{transform: [{rotate: `${captain?.heading}deg`}]}}>
                            <Image source={require('@/assets/icons/drop_marker.png')} style={{height: 30, width: 30, resizeMode: 'contain'}}/>
                        </View>
                    </Marker>
                )}

                {/** polyline */}
                {drop && pickup && (
                    <Polyline coordinates={getPoints([drop, pickup])} strokeColor={Colors.text} strokeWidth={2} geodesic lineDashPattern={[12, 10]}/>
                )}

                {/** gps button */}
                <TouchableOpacity style={mapStyles.container} onPress={fitToMarkers}>
                    <MaterialCommunityIcons name={'crosshairs-gps'} size={RFValue(16)} color={'#3C75BE'}/>
                </TouchableOpacity>
            </MapView>
        </View>
    );
}

export default memo(LiveTrackingMap);
