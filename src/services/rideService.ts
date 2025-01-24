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

export const getMyRides = async (isCustomer: boolean = true, router: Router) => {
    try {
        console.log('getMyRides');
        const res = await appAxios.get('/ride/rides');
        const filteredRides = res.data.rides?.filter((ride: any) => ride?.status === 'COMPLETED');
        if (filteredRides && filteredRides.length > 0) {
            router.navigate({
                pathname: isCustomer ? `/${Routes.CUSTOMER_LIVE_RIDE}` : `/${Routes.CAPTAIN_LIVE_RIDE}`,
                params: {
                    id: filteredRides[0]?._id,
                },
            });
        }
    } catch (error) {
        Alert.alert('Oh! Dang there was an error');
        console.error('inside catch of getMyRides:', error);
    }
}

export const acceptRideOffer = async (rideId: string, router: Router) => {
    try {
        console.log('acceptRideOffer');
        const res = await appAxios.patch(`/ride/accept/${rideId}`);
        /*resetAndNavigate({
            path: '',
            params: {id: rideId}
        });*/
        router.navigate({
            pathname: `/${Routes.CAPTAIN_LIVE_RIDE}`,
            params: {id: rideId},
        });
    } catch (error) {
        Alert.alert('Oh! Dang there was an error');
        console.error('inside catch of acceptRideOffer:', error);
    }
}

export const updateRideStatus = async (rideId: string, status: string) => {
    try {
        console.log('updateRideStatus');
        const res = await appAxios.patch(`/ride/update/${rideId}`, {status});
        return true;
    } catch (error: any) {
        Alert.alert('Oh! Dang there was an error');
        console.error('inside catch of updateRideStatus:', error);
        return false;
    }
}
