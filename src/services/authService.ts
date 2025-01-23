import {useCustomerStore} from "@/store/customerStore";
import {useCaptainStore} from "@/store/captainStore";
import {secureStorage, storeAccessToken, storeRefreshToken} from "@/store/storage";
import {resetAndNavigate} from "@/utils/Helpers";
import {Routes} from "@/utils/Routes";
import {Alert} from "react-native";
import axios from "axios";
import Apis from "@/utils/Apis";

// ✅✅✅
export const loginApi = async (payload: { role: 'customer' | 'captain', phone: string }, updateAccessToken: () => void) => {
    const {setUser: setCustomer} = useCustomerStore.getState();
    const {setUser: setCaptain} = useCaptainStore.getState();

    try {
        const response = await axios.post(Apis.loginApiUrl(), payload);
        const responseData = response.data;
        console.log('login responseStatus:', response.status);
        console.log('login responseData:', responseData);

        if (response.status === 200) {
            const {user, access_token, refresh_token} = responseData;
            if (user.role === 'customer') {
                setCustomer(user);
            } else if (user.role === 'captain') {
                setCaptain(user);
            }

            await Promise.all([
                storeAccessToken(access_token),
                storeRefreshToken(refresh_token),
            ]);
            console.log('user\'s role in loginApi:', user.role);

            if (user.role === 'customer') {
                resetAndNavigate(Routes.CUSTOMER_HOME);
            } else if (user.role === 'captain') {
                resetAndNavigate(Routes.CAPTAIN_HOME);
            }

            updateAccessToken();
        }
    } catch (error: any) {
        Alert.alert('Oh! Dang there was an error');
        console.log('Error:', error?.response?.data?.message || 'Error login');
    }
}

export const logout = async (disconnect?: () => void) => {
    if (disconnect) {
        disconnect();
    }

    const {clearData: clearCustomerData} = useCustomerStore.getState();
    const {clearData: clearCaptainData} = useCaptainStore.getState();

    await secureStorage.clearAll();
    clearCustomerData();
    clearCaptainData();
    resetAndNavigate(Routes.ROLE);
}
