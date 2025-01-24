import {Alert, FlatList, Image, TouchableOpacity, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {homeStyles} from "@/styles/homeStyles";
import {SafeAreaView} from "react-native-safe-area-context";
import {commonStyles} from "@/styles/commonStyles";
import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import CustomText from "@/components/shared/CustomText";
import {Colors} from "@/utils/Constants";
import {uiStyles} from "@/styles/uiStyles";
import LocationInput from "@/components/customer/location-input";
import {useEffect, useState} from "react";
import {calculateDistance, getLatLong, getPlacesSuggestions} from "@/utils/mapUtils";
import {locationStyles} from "@/styles/locationStyles";
import {useCustomerStore} from "@/store/customerStore";
import LocationItem from "@/components/customer/location-item";
import MapPickerModal from "@/components/customer/map-picker-modal";
import {navigate} from "@/utils/Helpers";
import {Routes} from "@/utils/Routes";

function SelectLocations() {
    const {location, setLocation} = useCustomerStore();

    const router = useRouter();
    const [pickup, setPickup] = useState('');
    const [pickupCoords, setPickupCoords] = useState<any>(null);
    const [drop, setDrop] = useState('');
    const [dropCoords, setDropCoords] = useState<any>(null);
    const [locations, setLocations] = useState([]);
    const [focusedInput, setFocusedInput] = useState('drop');
    const [modalTitle, setModalTitle] = useState('drop');
    const [isMapModalVisible, setIsMapModalVisible] = useState(false);

    const fetchLocation = async (query: string) => {
        if (query?.length > 4) {
            const data = await getPlacesSuggestions(query);
            setLocations(data);
        }
    }

    const addLocation = async (placeId: string) => {
        const data = await getLatLong(placeId);
        if (data) {
            if (focusedInput === 'drop') {
                setDrop(data?.address);
                setDropCoords(data);
            } else {
                setLocation(data);
                setPickup(data?.address);
                setPickupCoords(data);
            }
        }
    }

    const renderLocations = ({item}: any) => {
        return (
            <LocationItem item={item} onPress={() => addLocation(item?.place_id)}/>
        );
    }

    const checkDistance = async () => {
        if (!pickupCoords || !dropCoords) return;

        const {latitude: pickupLat, longitude: pickupLng} = pickupCoords;
        const {latitude: dropLat, longitude: dropLng} = dropCoords;
        if (pickupLat === dropLat && pickupLng === dropLng) {
            Alert.alert('Pickup and drop location can\'t be same. Please select different locations');
            return;
        }

        const distance = calculateDistance(pickupLat, pickupLng, dropLat, dropLng);
        const minDistance = 0.5;
        const maxDistance = 50;

        if (distance < minDistance) {
            Alert.alert('The selected locations are too close. Please choose locations that are further apart');
        } else if (distance > maxDistance) {
            Alert.alert('The selected locations are too far. Please choose a closer drop location');
        } else {
            setLocations([]);
            // navigate(router, Routes.CUSTOMER_RIDE_BOOKING);
            router.navigate({
                pathname: `/${Routes.CUSTOMER_RIDE_BOOKING}`,
                params: {
                    distanceInKm: distance.toFixed(2),
                    drop_latitude: dropCoords?.latitude,
                    drop_longitude: dropCoords?.longitude,
                    drop_address: drop,
                },
            });
            setDrop('');
            setPickup('');
            setDropCoords(null);
            setPickupCoords(null);
            setIsMapModalVisible(false);
            console.log('distance is valid:', distance.toFixed(2), 'km');
        }
    }

    useEffect(() => {
        if (location) {
            setPickupCoords(location);
            setPickup(location?.address);
        }
    }, [location]);

    useEffect(() => {
        if (dropCoords && pickupCoords) {
            checkDistance();
        } else {
            setLocations([]);
            setIsMapModalVisible(false);
        }
    }, [dropCoords, pickupCoords]);

    return (
        <View style={homeStyles.container}>
            <StatusBar style={'light'} backgroundColor={'orange'} translucent={false}/>
            <SafeAreaView/>
            <TouchableOpacity style={commonStyles.flexRow} onPress={() => router.back()}>
                <Ionicons name={'chevron-back'} size={24} color={Colors.iOSColor}/>
                <CustomText fontFamily={'Regular'} style={{color: Colors.iOSColor}}>Back</CustomText>
            </TouchableOpacity>

            <View style={uiStyles.locationInputs}>
                <LocationInput placeholder={'Search pickup location...'} type={'pickup'} value={pickup} onChangeText={(text) => {
                    setPickup(text);
                    fetchLocation(text);
                }} onFocus={() => setFocusedInput('pickup')}/>

                <LocationInput placeholder={'Search drop location...'} type={'drop'} value={drop} onChangeText={(text) => {
                    setDrop(text);
                    fetchLocation(text);
                }} onFocus={() => setFocusedInput('drop')}/>

                <CustomText fontFamily={'Medium'} fontSize={12} style={uiStyles.suggestionText}>
                    {focusedInput} suggestions
                </CustomText>
            </View>

            <FlatList data={locations} renderItem={renderLocations} keyExtractor={(item: any) => item?.place_id} initialNumToRender={5} windowSize={5} ListFooterComponent={
                <TouchableOpacity style={[commonStyles.flexRow, locationStyles.container]} onPress={() => {
                    setModalTitle(focusedInput);
                    setIsMapModalVisible(true);
                }}>
                    <Image source={require('@/assets/icons/map_pin.png')} style={uiStyles.mapPinIcon}/>
                    <CustomText fontFamily={'Medium'} fontSize={12}>Select from Map</CustomText>
                </TouchableOpacity>
            }/>

            {isMapModalVisible && (
                <MapPickerModal selectedLocation={{
                    latitude: focusedInput === 'drop' ? dropCoords?.latitude : pickupCoords?.latitude,
                    longitude: focusedInput === 'drop' ? dropCoords?.longitude : pickupCoords?.longitude,
                    address: focusedInput === 'drop' ? dropCoords?.address : pickupCoords?.address,
                }} title={modalTitle} visible={isMapModalVisible} onClose={() => setIsMapModalVisible(false)} onSelectLocation={(data: any) => {
                    if (data) {
                        // if (modalTitle === 'drop') {
                        if (focusedInput === 'drop') {
                            setDropCoords(data);
                            setDrop(data?.address);
                        } else {
                            setPickupCoords(data);
                            setPickup(data?.address);
                        }
                    }
                }}/>
            )}
        </View>
    );
}

export default SelectLocations;
