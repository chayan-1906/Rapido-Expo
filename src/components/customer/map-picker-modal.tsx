import {FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View} from "react-native";
import {modalStyles} from "@/styles/modalStyles";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {RFValue} from "react-native-responsive-fontsize";
import {getLatLong, getPlacesSuggestions, reverseGeocode} from "@/utils/mapUtils";
import {memo, useEffect, useRef, useState} from "react";
import MapView, {Region} from "react-native-maps";
import {useCustomerStore} from "@/store/customerStore";
import LocationItem from "@/components/customer/location-item";
import {customMapStyle, indiaInitialRegion} from "@/utils/CustomMap";
import {mapStyles} from "@/styles/mapStyles";
import * as Location from "expo-location";

interface MapPicketModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    selectedLocation: {
        latitude: number;
        longitude: number;
        address: string;
    };
    onSelectLocation: (location: any) => void;
}

function MapPickerModal({selectedLocation, title, visible, onClose, onSelectLocation}: MapPicketModalProps) {
    const mapRef = useRef<MapView>(null);
    const textInputRef = useRef<TextInput>(null);
    const [text, setText] = useState('');
    const {location, setLocation} = useCustomerStore();
    const [address, setAddress] = useState('');
    const [region, setRegion] = useState<Region | null>(null);
    const [locations, setLocations] = useState([]);

    const fetchLocation = async (query: string) => {
        if (query?.length > 4) {
            const data = await getPlacesSuggestions(query);
            setLocations(data);
        } else {
            setLocations([]);
        }
    }

    const addLocation = async (placeId: string) => {
        const data = await getLatLong(placeId);
        if (data) {
            const {latitude, longitude} = data;
            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            });
        }
        textInputRef.current?.blur();
        setText('');
    }

    const renderLocations = ({item}: any) => {
        return (
            <LocationItem item={item} onPress={() => addLocation(item?.place_id)}/>
        );
    }

    const handleRegionChangeComplete = async (region: Region) => {
        try {
            const address = await reverseGeocode(region?.latitude, region?.longitude);
            setRegion(region);
            setAddress(address);
        } catch (error) {
            console.log('inside catch of handleRegionChangeComplete:', error);
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

    useEffect(() => {
        const {latitude, longitude, address} = selectedLocation;
        if (latitude) {
            setAddress(address);
            setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            });
            mapRef?.current?.fitToCoordinates([{
                latitude,
                longitude,
            }], {
                edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
                animated: true,
            });
        }
    }, [selectedLocation, mapRef]);

    return (
        <Modal animationType={'slide'} visible={visible} presentationStyle={'formSheet'} onRequestClose={onClose}>
            <View style={modalStyles.modalContainer}>
                <Text style={modalStyles.centerText}>Select {title}</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={modalStyles.cancelButton}>Cancel</Text>
                </TouchableOpacity>

                <View style={modalStyles.searchContainer}>
                    <Ionicons name={'search-outline'} size={RFValue(16)} color={'#777'}/>
                    <TextInput ref={textInputRef} style={modalStyles.input} placeholder={'Search address...'} placeholderTextColor={'#AAA'} value={text} onChangeText={(text) => {
                        setText(text);
                        fetchLocation(text);
                    }}/>
                </View>

                {text !== '' ? (
                    <FlatList data={locations} renderItem={renderLocations} keyExtractor={(item: any) => item?.place_id} initialNumToRender={5} windowSize={5} ListHeaderComponent={
                        <View>
                            {text.length > 4 ? null : (
                                <Text style={{marginHorizontal: 16}}>Enter at least 4 characters to search...</Text>
                            )}
                        </View>
                    }/>
                ) : (
                    <>
                        {/** map */}
                        <View style={{flex: 1, width: '100%'}}>
                            <MapView ref={mapRef} initialRegion={{
                                latitude: region?.latitude ?? location?.latitude ?? indiaInitialRegion?.latitude,
                                longitude: region?.longitude ?? location?.longitude ?? indiaInitialRegion?.longitude,
                                latitudeDelta: 0.5,
                                longitudeDelta: 0.5,
                            }}
                                // minZoomLevel={9}
                                // maxZoomLevel={16}
                                // cameraZoomRange={{minCenterCoordinateDistance: 12, maxCenterCoordinateDistance: 16}}
                                     pitchEnabled={false} onRegionChangeComplete={handleRegionChangeComplete} style={{flex: 1}} customMapStyle={customMapStyle}
                                     showsMyLocationButton={false} showsCompass={false} showsIndoors={false} showsIndoorLevelPicker={false} showsTraffic={false} showsScale={false} showsBuildings={false}
                                     showsPointsOfInterest={false} showsUserLocation={true}/>

                            <View style={mapStyles.centerMarkerContainer}>
                                <Image source={title === 'drop' ? require('@/assets/icons/drop_marker.png') : require('@/assets/icons/marker.png')} style={mapStyles.marker}/>
                            </View>

                            <TouchableOpacity style={mapStyles.gpsButton} onPress={handleGPSButton}>
                                <MaterialCommunityIcons name={'crosshairs-gps'} size={RFValue(18)} color={'#3C75BE'}/>
                            </TouchableOpacity>
                        </View>

                        {/** footer */}
                        <View style={modalStyles.footerContainer}>
                            <Text style={modalStyles.addressText} numberOfLines={2}>{address === '' ? 'Getting address...' : address}</Text>
                            <View style={modalStyles.buttonContainer}>
                                <TouchableOpacity style={modalStyles.button} onPress={() => onSelectLocation({type: title, latitude: region?.latitude, longitude: region?.longitude, address})}>
                                    <Text style={modalStyles.buttonText}>Set Address</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </Modal>
    );
}

export default memo(MapPickerModal);
