import {Router} from "expo-router";
import {Routes} from "@/utils/Routes";
import {appAxios} from "@/services/apiInterceptors";
import {Alert} from "react-native";

interface Coords {
    address: string;
    latitude: number;
    longitude: number;
}

export const createRide = async (payload: {
    vehicle: 'bike' | 'auto' | 'cabEconomy' | 'cabPremium',
    pickup: Coords,
    drop: Coords,
}, router: Router) => {
    try {
        console.log('createRide payload:', payload);
        const res = await appAxios.post('/ride/create', payload);
        router.navigate({
            pathname: `/${Routes.CUSTOMER_LIVE_RIDE}`,
            params: {
                id: res?.data?.ride?._id,
            },
        });
    } catch (error) {
        Alert.alert('Oh! Dang there was an error');
        console.error('inside catch of createRide:', error);
    }
}
